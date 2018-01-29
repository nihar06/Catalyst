package codeingpart;

public class MergeSort {

	static void merge(int l, int m, int r, int[] arr) {
		int n1 = m - l + 1;
		int n2 = r - m;
		int[] left = new int[n1];
		int[] right = new int[n2];

		//copy in left and right array 
		for (int i = 0; i < n1; i++) {
			left[i] = arr[l + i];
		}
		for (int i = 0; i < n2; i++) {
			right[i] = arr[m + 1 + i];
		}

		//compare arrays
		int i = 0, j = 0;
		int k = l;
		while (i < n1 && j < n2) {
			if (left[i] <= right[j]) {
				arr[k] = left[i];
				i++;
				k++;
			} else {
				arr[k] = right[j];
				j++;
				k++;
			}
		}
		while (i < n1) {
			arr[k] = left[i];
			i++;
			k++;
		}
		while (j < n2) {
			arr[k] = right[j];
			j++;
			k++;
		}
	}

	static void sort(int l, int[] arr, int r) {
		if (l < r) {
			int m = (l + r) / 2; //get midpoint
			sort(l, arr, m); //divide from midpoint, left part
			sort(m + 1, arr, r);//right part
			if (arr[m] > arr[m + 1]) //merge only if array is not sorted
				merge(l, m, r, arr); //merge
		}
	}

	public static void main(String[] args) {

		int[] arr = { 1, 2, 7, 9, 4, 5, 13 };
		sort(0, arr, arr.length - 1);
		printArray(arr);
	}

	static void printArray(int arr[]) {
		int n = arr.length;
		for (int i = 0; i < n; ++i)
			System.out.print(arr[i] + " ");
		System.out.println();
		
	}
}
