package codeingpart;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;

public class Compare {

	public static void main(String[] args) {

		ArrayList<Integer> a1 = new ArrayList<>();
		a1.add(1);
		a1.add(22);
		a1.add(5);
		a1.add(7);
		a1.add(21);
		Collections.sort(a1, new Comparator<Integer>()  {
			@Override
			public int compare(Integer o1, Integer o2) {
				return (o2 - o1);
			}
		});
		System.out.println(a1);

		a1.sort((Integer o1, Integer o2) -> o1 - o2);
		System.out.println(a1);
		
		
		a1.sort(new comparetor());
		System.out.println(a1);
	}

}

class comparetor implements Comparator<Integer> {

	@Override
	public int compare(Integer o1, Integer o2) {
		return (o2 - o1);
	}

}