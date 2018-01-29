package codeingpart;

import java.util.Arrays;

public class str {

	public static void main(String[] args) {

		String test = "abc ef";
		char[] ans = new char[test.length()];
		for (int i = 0; i < test.length(); i++) {
			char a = test.charAt(i);
			if (a != ' ')
				a++;

			ans[i] = a;
		}
		String ans1 = Arrays.toString(ans);
		System.out.println(ans1);

		System.out.println(reverse("hello"));

	}

	static String reverse(String str) {

		char[] revStr = str.toCharArray();
		for (int i = 0, j = revStr.length - 1; i < j; i++, j--) {
			char temp = revStr[i];
			revStr[i] = revStr[j];
			revStr[j] = temp;
		}
		return Arrays.toString(revStr);
	}
}
