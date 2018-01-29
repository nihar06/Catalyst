package codeingpart;

import java.util.HashMap;
import java.util.Map;

public class TestClass {
	// Anagram: a word, phrase, or name formed by rearranging the letters of
	// another, such as cinema, formed from iceman.
	//
	// examples:
	// - "aab" : "aba" --> YES
	// - "bba" : "aba" --> NO
	public static final boolean areStringsAnagrams(String one, String two) {
		// if lengths are different
		if (one.length() != two.length()) {
			return false;
		}

		Map<Character, Integer> hMap = new HashMap<>();
		// add values from first string
		for (int i = 0; i < one.length(); i++) {

			if (hMap.containsKey(one.charAt(i)) == true) {
				int a = hMap.get(one.charAt(i));
				a++;
				hMap.put(one.charAt(i), a);
			} else {
				hMap.put(one.charAt(i), 1);
			}
		}
		// check in second string
		for (int i = 0; i < two.length(); i++) {
			if (hMap.containsKey(two.charAt(i)) == true) {
				int a = hMap.get(two.charAt(i));
				a--;
				hMap.put(two.charAt(i), a);
			} else
				return false;
		}
		// check values in hMap
		for (int count : hMap.values()) {
			if (count != 0) {
				return false;
			}
		}
		return true;
	}

	public static void main(String[] args) {
		System.out.println(areStringsAnagrams("baba", "aabb"));
		
		/*AssertFalse(TestClass.areStringsAnagrams("aaa", "aaaa"));
		AssertFalse(TestClass.areStringsAnagrams("aaaabb", "baaaa"));
		AssertFalse(TestClass.areStringsAnagrams("aab", "bbbb"));
		AssertFalse(TestClass.areStringsAnagrams("abc", "def"));
		AssertTrue(TestClass.areStringsAnagrams("cba", "abc"));*/
	}
}