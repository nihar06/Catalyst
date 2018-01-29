package codeingpart;

public class Test {

	public enum errcode {
		OK(0), BAD_PARAMETER(1);
		private final int value_;

		public int get_vallue() {
			return this.value_;
		}

		private errcode(int e) {
			this.value_ = e;
		}
	}

	public static void main(String[] args) {
		errcode a;
		a = errcode.BAD_PARAMETER;
	}
}
