package codeingpart;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

class IntegerComparator implements Comparator<Integer> {

	@Override
	public int compare(Integer o1, Integer o2) {
		return o2.compareTo(o1);
	}
}

public class ClssDevision {

	public int[] sortByPercentage(Integer[] input) {

		// Arrays.sort(input);

		Arrays.sort(input, Collections.reverseOrder());

		System.out.println(Arrays.toString(input));
		List<Integer> a = new ArrayList<>();
		List<Integer> b = new ArrayList<>();
		List<Integer> c = new ArrayList<>();
		List<Integer> d = new ArrayList<>();
		List<Integer> e = new ArrayList<>();
		int i = 0;
		boolean tf = false;
		while (i <= Math.ceil(input.length * 0.2) || tf) {
			a.add(input[i]);
			if (input[i] == input[i + 1]) {
				tf = true;
			} else
				tf = false;
			i++;
		}
		System.out.println(a + "\n");
		while (i <= Math.ceil(input.length * 0.4) || tf) {
			b.add(input[i]);
			if (input[i] == input[i + 1]) {
				tf = true;
			} else
				tf = false;
			i++;
		}

		System.out.println(b + "\n");
		while (i <= Math.ceil(input.length * 0.6) || tf) {
			c.add(input[i]);
			if (input[i] == input[i + 1]) {
				tf = true;
			} else
				tf = false;
			i++;
		}

		System.out.println(c + "\n");
		while (i <= Math.ceil(input.length * 0.8) || tf) {
			d.add(input[i]);
			if (input[i] == input[i + 1]) {
				tf = true;
			} else
				tf = false;
			i++;
		}
		System.out.println(input.length);
		while (i < Math.ceil(input.length)) {
			e.add(input[i]);
			System.out.println(input[i]);
			i++;
		}

		System.out.println("\n" + a + "\n" + b + "\n" + "\n" + c + "\n" + d + "\n" + e);

		return null;

	}

	// I took this method from web.

	public static int[][] chunkArray(int[] array, int chunkSize) {

		int numOfChunks = (int) Math.ceil((double) array.length / chunkSize);

		int[][] output = new int[numOfChunks][];

		for (int i = 0; i < numOfChunks; ++i) {

			int start = i * chunkSize;

			int length = Math.min(array.length - start, chunkSize);

			int[] temp = new int[length];

			System.arraycopy(array, start, temp, 0, length);

			output[i] = temp;

		}

		return output;

	}

	public static void main(String[] args) {

		Integer[] input = { 75, 20, 20, 20, 20, 20, 20, 85, 83, 82, 80, 79, 78, 78, 77, 76, 75, 74, 62, 55, 43, 20, 99,
				92, 91, 89, 91 };

		ClssDevision cd = new ClssDevision();

		cd.sortByPercentage(input);

		// System.out.println(Arrays.deepToString(chunkArray(input, length)));

	}

}