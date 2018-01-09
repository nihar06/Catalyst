package com.kbace.changemanagement.util;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import static com.kbace.changemanagement.util.DirectoryConstants.*;

@Service
public class FileUtilities {

	public String uploadFile(MultipartFile file) throws IOException {

		if (!file.getOriginalFilename().isEmpty()) {

			File uploadFile = new File(UPLOAD_DIRECTORY, file.getOriginalFilename());
			if (!uploadFile.exists()) {
				uploadFile.mkdir();
			}

			BufferedOutputStream outputStrem = new BufferedOutputStream(new FileOutputStream(uploadFile));
			outputStrem.write(file.getBytes());
			outputStrem.flush();
			outputStrem.close();
			System.out.println("File uploaded.. ");
			return file.getOriginalFilename();
		} else {
			System.out.println("File not uploaded.. ");
			return "No file uploaded";
		}
	}

	public void deleteFile(String titleId) {
		File dir = new File(UPLOAD_DIRECTORY + File.separator + titleId);
		dir.delete();
	}
}