package codeingpart;

import java.util.ArrayList;

public class fibo {

	static ArrayList<Integer> getFibo(int n, ArrayList<Integer> fibo) {

		int a = 0;
		int b = 1;
		if (fibo.size() > 0) {
			if (fibo.size() < n) {
				a = fibo.get(fibo.size() - 2);
				b = fibo.get(fibo.size() - 1);
			} else
				return fibo;
		} else {

			fibo.add(a);
			fibo.add(b);
		}
		for (int i = fibo.size()-2; i < n - 2; i++) {
			int temp = b;
			b = a + b;
			a = temp;
			fibo.add(b);
		}
		return fibo;
	}

	static int getSum(int n, ArrayList<Integer> fibo) {
		if (n+2 > fibo.size())
			getFibo(n+2, fibo);
		return fibo.get(n + 1) - 1;
	}

	public static void main(String[] args) {
		ArrayList<Integer> fibo = new ArrayList<>();
		//System.out.println(getFibo(7, fibo));

		System.out.println(getSum(3, fibo));
		//System.out.println(fibo);
		System.out.println(getSum(5, fibo));
		System.out.println(fibo);
		System.out.println(getSum(4, fibo));
		System.out.println(fibo);
	}
}
