package codeingpart;

class A {
	public A() {
		System.out.println("class A constructor");
	}

	public void anyMethod() {
		System.out.println("class A method");
	}
}

class B extends A {

	public B() {
		// super();
		System.out.println("class B constructor");
	}

	@Override
	public void anyMethod() {
		System.out.println("class B method");
	//	super.anyMethod();
	}
}

public class SuperCassDemo {
	public static void main(String[] args) {
	//	A a = new A();
		A b = new B();

		b.anyMethod();
	}
}
