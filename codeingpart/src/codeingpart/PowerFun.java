package codeingpart;

public class PowerFun {

	static int calPower(int b, int p) {
		int a = 1;
		int ans = b;
		if (p == 0)
			return 1;
		if (p % 2 == 1) {
			a = b;
		}
		while (p > 1) {
			ans *= ans;
			p /= 2;
		}

		return ans * a;
	}

	static int recPow(int b, int p) {
		int a = 1;
		if (p == 0)
			return 1;
		if (p % 2 == 1) {
			a = b;
		}
		return a * recPow(b, p / 2) * recPow(b, p / 2);
		// return b * recPow(b, p - 1);
	}

	public static void main(String[] args) {
		System.out.println("power function");
		System.out.println(calPower(6, 2));
		System.out.println(recPow(5, 4));
	}

}
