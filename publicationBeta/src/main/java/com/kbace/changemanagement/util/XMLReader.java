package com.kbace.changemanagement.util;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.sql.Timestamp;
import java.util.Calendar;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.w3c.dom.Element;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import com.kbace.changemanagement.entity.Content;
import static com.kbace.changemanagement.util.DirectoryConstants.*;

@Service
public class XMLReader {

	private File inputFile;

	public Content getContentInfo(String xmlFile) throws ParserConfigurationException, SAXException, IOException {

		this.inputFile = new File(xmlFile + File.separator + "contextmap.xml");
		DocumentBuilderFactory documentBuilderFactory = DocumentBuilderFactory.newInstance();
		DocumentBuilder documentBuilder = documentBuilderFactory.newDocumentBuilder();
		Document document = documentBuilder.parse(this.inputFile);
		document.getDocumentElement().normalize();

		NodeList nlist = document.getElementsByTagName("Document"); // doc list
		Node node = nlist.item(0);

		System.out.println(node.getNodeName());

		Element element = (Element) node;
		System.out.println(element.getElementsByTagName("DocId").item(0).getTextContent());
		Content module = new Content();

		File dir = new File(xmlFile);

		// get current directory
		File _KDataDir = new File(PHYSICAL_DIR);

		// Create directory if it is not there
		if (!_KDataDir.exists())
			_KDataDir.mkdir();

		// delete directory if exists.
		if (new File(
				_KDataDir.getPath() + File.separator + element.getElementsByTagName("DocId").item(0).getTextContent())
						.exists()) {
			org.apache.commons.io.FileUtils.deleteDirectory(new File(_KDataDir.getPath() + File.separator
					+ element.getElementsByTagName("DocId").item(0).getTextContent()));
		}

		// make directory in KData directory with DocID as name
		File contentDir = new File(
				_KDataDir.getPath() + File.separator + element.getElementsByTagName("DocId").item(0).getTextContent());
		contentDir.mkdir();

		// move unziped directory to folder with its DocID.

		Files.move(dir.toPath(), contentDir.toPath(), StandardCopyOption.REPLACE_EXISTING);

		module.setContent_id(element.getElementsByTagName("DocId").item(0).getTextContent()); // DocId
		module.setTitle(element.getElementsByTagName("DocumentName").item(0).getTextContent()); // Title

		module.setContent_path(VIRTUAL_DIR + "/" + contentDir.getName() + "/index.html"); // Path
		module.setLast_updated(new Timestamp(Calendar.getInstance().getTime().getTime()));
		dir.delete();

		return module;
	}
}