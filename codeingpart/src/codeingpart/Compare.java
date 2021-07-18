package codeingpart;

import java.security.KeyStore.Entry;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
		
		Comparator<java.util.Map.Entry<Integer, Integer>> comp= new Comparator<Map.Entry<Integer,Integer>>() {
			
			@Override
			public int compare(java.util.Map.Entry<Integer, Integer> o1, java.util.Map.Entry<Integer, Integer> o2) {
				return o1.getValue().compareTo(o2.getValue());
			}
		};
		
		Map<Integer, Integer> m = new HashMap<>();
		m.put(1, -10);
		m.put(0, -3);
		m.put(5, 7);
		
		List<java.util.Map.Entry<Integer, Integer>> ls = new ArrayList(m.entrySet());
		
		ls.sort((java.util.Map.Entry<Integer, Integer> o1, java.util.Map.Entry<Integer, Integer> o2) -> o1.getKey().compareTo(o1.getKey()));
		System.out.println(ls);
		
		Collections.sort(ls, comp);
		
		System.out.println(ls);
	}

}

class comparetor implements Comparator<Integer> {

	@Override
	public int compare(Integer o1, Integer o2) {
		return (o2 - o1);
	}

}