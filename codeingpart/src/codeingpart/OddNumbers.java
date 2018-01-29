package codeingpart;

import java.util.ArrayList;

public class OddNumbers {

	public static void main(String[] args) {
		System.out.println(getOdd(1, 100));
		System.out.println(Integer.toBinaryString(100));
	}

	static ArrayList<Integer> getOdd(int start, int end) {

		ArrayList<Integer> numbers = new ArrayList<>();
		if (start % 2 != 1)
			start++;
		if (end % 2 != 1)
			end--;
		for (int i = start; i <= end; i += 2) {
			numbers.add(i);
		}
		return numbers;
	}

}
