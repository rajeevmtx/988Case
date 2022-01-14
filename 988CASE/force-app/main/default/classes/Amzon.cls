public class Amzon {
    
    public static void printSubArrays (List<Integer> arr, Integer start , Integer end1){
        List<Integer> diff = new List<Integer>();
        if (end1 == arr.size())
            return;
        
        // Increment the end point and start from 0
        else if (start > end1)
            printSubArrays(arr, 0, end1 + 1);
        
        // Print the subarray and increment the starting point
        else
        {
            //System.debug('[');
            List<Integer> st = new List<Integer>();
            for (Integer i = start; i < end1; i++){
                //System.debug(arr[i]+',');
                //Integer invv = arr[i]-arr[end1-1];
                st.add(arr[i]);
                //system.debug('======= st '+st);
                //diff.add(arr[i]-arr[end1]);
                
            }
            //st.sort();
            //diff.add(st[0],st[st.size()-1]);
           // system.debug('=== Diff '+diff);
            //System.debug(arr[end1]+']');
            st.add(arr[end1]);
            system.debug('======= st '+st);
            if(st.size() ==1){
                
            }else {
                diff.add(st[st.size()-1]-st[0]);
            	system.debug('======= diff '+diff);
            }
            st.clear();
            
            

            printSubArrays(arr, start + 1, end1);
        }
        
        //return 0;
    }


}