package de.brights.rechnungsgenerator.services;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import de.brights.rechnungsgenerator.entity.Rechnung;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Stream;

@Service
public class PdfService {

    private static final Locale DE = Locale.GERMANY;
    private static final DateTimeFormatter DF = DateTimeFormatter.ofPattern("dd.MM.yyyy");
    // NBSP als nummerische Entity (openhtmltopdf mag &nbsp; nicht)
    private static final String NBSP = "&#160;";

    // Preis am Zeilenende erkennen (z. B. "— 123,00 €", "- 1.234,56", " 99 EUR")
    private static final Pattern END_PRICE = Pattern.compile(
            "(?i)\\s*(?:[-–—:]\\s*)?(\\d{1,3}(?:[\\.,]\\d{3})*(?:[\\.,]\\d{2})?|\\d+)(?:\\s*(?:€|EUR))?\\s*$");

    public byte[] buildInvoicePdf(Rechnung r, String primaryColorHex, Path uploadDir) throws IOException {
        if (r == null) throw new IllegalArgumentException("Rechnung ist null");
        var f = r.getFirma();
        var k = r.getKunde();

        // Farbe
        String color = (primaryColorHex == null || primaryColorHex.isBlank()) ? "#00A3A3" : primaryColorHex.trim();
        if (!color.startsWith("#")) color = "#" + color;

        // Logo als data:URI (falls vorhanden)
        String logoDataUri = null;
        if (f != null && f.getLogoUrl() != null && !f.getLogoUrl().isBlank() && uploadDir != null) {
            Files.createDirectories(uploadDir);
            try (Stream<Path> st = Files.list(uploadDir)) {
                var opt = st.filter(p -> p.getFileName().toString().startsWith("company-" + f.getId() + ".")).findFirst();
                if (opt.isPresent()) {
                    Path p = opt.get();
                    String mime = Files.probeContentType(p);
                    byte[] bytes = Files.readAllBytes(p);
                    logoDataUri = "data:" + (mime != null ? mime : "image/png") + ";base64," +
                            Base64.getEncoder().encodeToString(bytes);
                }
            }
        }

        // USt-Logik
        boolean mitUst = f != null && Boolean.TRUE.equals(f.getUmsatzsteuer());
        BigDecimal netto  = r.getBetrag() != null ? r.getBetrag() : BigDecimal.ZERO;
        BigDecimal ust    = mitUst ? netto.multiply(new BigDecimal("0.19")).setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
        BigDecimal gesamt = netto.add(ust);

        String infoBlock = mitUst ? "" :
                """
                <div class="mt24 muted">Zusätzliche Informationen<br/>
                Im Sinne der Kleinunternehmerregelung nach § 19 UStG enthält der ausgewiesene Betrag keine Umsatzsteuer.
                </div>
                """;

        // Positionstext in Zeilen aufsplitten
        String leistung = nvl(r.getLeistung(), "Leistung");
        String[] rawLines;
        if (leistung.contains("\n")) {
            rawLines = leistung.split("\\r?\\n");
        } else if (leistung.matches(".*\\d+\\)\\s*.*")) {
            rawLines = leistung.split("(?=\\d+\\)\\s*)");
        } else {
            rawLines = new String[]{ leistung };
        }

        // Zeilen zu <tr> bauen: Beschreibung links, erkannter Preis rechts
        StringBuilder rows = new StringBuilder();
        for (String raw : rawLines) {
            String line = raw.replace('–', '-').replace('—', '-').trim();
            // Präfixe wie "1) " entfernen
            line = line.replaceFirst("^\\s*\\d+\\)\\s*", "");
            String desc = line;
            String priceHtml = NBSP;

            Matcher m = END_PRICE.matcher(line);
            if (m.find()) {
                String num = m.group(1);
                BigDecimal parsed = parseEuro(num);
                if (parsed != null) {
                    priceHtml = money(parsed) + " €";
                    // Beschreibung ist der Teil vor dem gefundenen Betrag
                    desc = line.substring(0, m.start()).replaceAll("[-:\\s]+$", "");
                }
            }

            desc = desc.isBlank() ? NBSP : esc(desc);
            rows.append("<tr>\n");
            rows.append("  <td>").append(desc).append("</td>\n");
            rows.append("  <td class=\"right price\">").append(priceHtml).append("</td>\n");
            rows.append("</tr>\n");
        }

        // HTML-Template
        String html = """
<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8"/>
<style>
  @page { size: A4; margin: 24mm 18mm 22mm 18mm; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial; color:#1c1c1e; }
  .brand { color: %(COLOR)s; font-size: 28px; font-weight: 800; }
  .rule { height: 4px; background: %(COLOR)s; margin: 12px 0 28px; }
  .box { background:#f5f5f7; padding:10px 14px; border-radius:8px; font-size:12px; display:inline-block; }
  h3 { margin:0 0 6px; font-size:13px; }
  .muted { color:#6b7280; font-size:12px; }
  .mt24 { margin-top:24px; }
  .mt32 { margin-top:32px; }
  table { width:100%; border-collapse: collapse; font-size:12px; table-layout: fixed; }
  th, td { padding:10px 8px; border-bottom:1px solid #e5e7eb; }
  th { text-align:left; background:#f9fafb; }
  .right { text-align:right; }
  .price { white-space: nowrap; }
  .sumrow td { border:none; padding:6px 8px; }
  .total { color:%(COLOR)s; font-weight:800; font-size:16px; }
  .footer { position: fixed; bottom: 0; left:0; right:0; height: 28px; background:%(COLOR)s; }
  .logo { max-height: 46px; }
  .headergrid { width:100%; border-collapse:collapse; }
  .headergrid td.left  { vertical-align:top; width:60%; }
  .headergrid td.right { vertical-align:top; width:40%; text-align:right; }
</style>
</head>
<body>

<div class="brand">Rechnung | %(FIRMA_NAME)s</div>
<div class="rule"></div>

<table class="headergrid">
  <tr>
    <td class="left">
      <h3>%(FIRMA_NAME)s</h3>
      <div class="muted">%(FIRMA_ADDR)s<br/>%(FIRMA_PLZ)s %(FIRMA_ORT)s<br/>Deutschland</div>
    </td>
    <td class="right">
      <div class="box">
        <div><b>Rechnungsdatum:</b> %(DATUM)s</div>
        <div><b>Rechnungsnummer:</b> %(NUMMER)s</div>
      </div>
    </td>
  </tr>
</table>

<div class="mt24">
  <h3>Empfänger:</h3>
  <div><b>%(KUNDE_NAME)s</b></div>
  <div class="muted">%(KUNDE_ADDR)s<br/>%(KUNDE_PLZ)s %(KUNDE_ORT)s<br/>Deutschland</div>
</div>

%(INFO)s

<div class="mt24">
  <table>
    <thead>
      <tr>
        <th>Bezeichnung</th>
        <th class="right">Einheitspreis</th>
      </tr>
    </thead>
    <tbody>
      %(ROWS)s
    </tbody>
  </table>
</div>

<div class="mt32">
  <table>
    <tr class="sumrow"><td class="right"><b>Nettobetrag:</b></td><td class="right"><b>%(NETTO)s €</b></td></tr>
    <tr class="sumrow"><td class="right">%(UST_LABEL)s:</td><td class="right">%(UST)s €</td></tr>
    <tr class="sumrow"><td class="right total">Rechnungsbetrag:</td><td class="right total">%(GESAMT)s €</td></tr>
  </table>
</div>

<div class="footer"></div>
%(LOGO)s

</body>
</html>
""";

        // Logo oben rechts (über dem Strich)
        String logoHtml = "";
        if (logoDataUri != null) {
            logoHtml = "<img src=\"" + logoDataUri + "\" style=\"position:fixed; top:1mm; right:18mm; z-index:999;\" class=\"logo\" />";
        }

        // Platzhalter ersetzen
        html = html.replace("%(COLOR)s", color)
                .replace("%(FIRMA_NAME)s", esc(nvl(f != null ? f.getName() : null, "")))
                .replace("%(FIRMA_ADDR)s", esc(nvl(f != null ? f.getStrasse() : null, "")))
                .replace("%(FIRMA_PLZ)s",  esc(nvl(f != null ? f.getPlz() : null, "")))
                .replace("%(FIRMA_ORT)s",  esc(nvl(f != null ? f.getOrt() : null, "")))
                .replace("%(DATUM)s",      r.getDatum() != null ? r.getDatum().format(DF) : "")
                .replace("%(NUMMER)s",     esc(nvl(r.getRechnungsnummer(), "")))
                .replace("%(KUNDE_NAME)s", esc(nvl(k != null ? k.getName() : null, "")))
                .replace("%(KUNDE_ADDR)s", esc(nvl(k != null ? k.getStrasse() : null, "")))
                .replace("%(KUNDE_PLZ)s",  esc(nvl(k != null ? k.getPlz() : null, "")))
                .replace("%(KUNDE_ORT)s",  esc(nvl(k != null ? k.getOrt() : null, "")))
                .replace("%(INFO)s",       infoBlock)
                .replace("%(ROWS)s",       rows.toString())
                .replace("%(NETTO)s",      money(netto))
                .replace("%(UST)s",        money(ust))
                .replace("%(UST_LABEL)s",  mitUst ? "Umsatzsteuer (19%)" : "Umsatzsteuer")
                .replace("%(GESAMT)s",     money(gesamt))
                .replace("%(LOGO)s",       logoHtml);

        var out = new ByteArrayOutputStream();
        var builder = new PdfRendererBuilder();
        builder.useFastMode();
        builder.withHtmlContent(html, null);
        builder.toStream(out);
        try {
            builder.run();
        } catch (Exception e) {
            throw new IOException("PDF-Rendering fehlgeschlagen", e);
        }
        return out.toByteArray();
    }

    /* ---------------- Helpers ---------------- */

    // Robustes Parsen von Euro-Beträgen aus Strings
    private static BigDecimal parseEuro(String s) {
        if (s == null) return null;
        String raw = s.replaceAll("[^0-9.,]", "");
        if (raw.isEmpty()) return null;

        boolean hasComma = raw.indexOf(',') >= 0;
        boolean hasDot   = raw.indexOf('.') >= 0;
        String normalized;

        if (hasComma && hasDot) {
            // "1.234,56" -> Tausenderpunkte raus, Komma als Dezimalpunkt
            normalized = raw.replace(".", "").replace(',', '.');
        } else if (hasComma) {
            // "123,45" -> Komma als Dezimalpunkt
            normalized = raw.replace(',', '.');
        } else {
            // "123.45" -> Punkt als Dezimalpunkt (lassen!)
            normalized = raw;
        }

        try {
            return new BigDecimal(normalized);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private static String money(BigDecimal v) {
        return String.format(DE, "%,.2f", v != null ? v : BigDecimal.ZERO);
    }
    private static String nvl(String s, String def) { return (s == null || s.isBlank()) ? def : s; }
    private static String esc(String s) {
        return s.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;");
    }
}