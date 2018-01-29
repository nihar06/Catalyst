package codeingpart;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.HashSet;
import java.util.Scanner;

public class FileAndHashTable {

	public static void main(String[] args) throws IOException {

		Scanner sc = new Scanner(new File("C:\\Users\\641805.CTS\\Desktop\\MVC\\codeingpart\\src\\codeingpart\\a.txt"));
		StringBuffer str = new StringBuffer();
		HashSet<String> hSet = new HashSet<>();

		while (sc.hasNext()) {
			String word = sc.next();
			if (!hSet.contains(word)) {
				str.append(word+" ");
			}
			hSet.add(word);
		}
		sc.close();
		System.out.println(hSet);
		FileWriter fw = new FileWriter("C:\\Users\\641805.CTS\\Desktop\\MVC\\codeingpart\\src\\codeingpart\\a.txt");
		BufferedWriter bw = new BufferedWriter(fw);
		System.out.println(str);
		bw.write(str.toString());
		bw.close();
		System.out.println(str.reverse());
	}
}
