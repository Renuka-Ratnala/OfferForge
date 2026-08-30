package com.offerforge.util;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;

@Component
public class ResumeTextExtractor {

    public String extractText(String filePath) throws IOException {

        File file = new File(filePath);

        if (!file.exists()) {
            throw new IOException(
                    "Resume file not found: " + filePath
            );
        }

        try (PDDocument document = Loader.loadPDF(file)) {

            PDFTextStripper stripper =
                    new PDFTextStripper();

            return stripper.getText(document);
        }
    }
}