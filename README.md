# 問題
超高層ビル「みなとハルカス」    
URL:https://onlinejudge.u-aizu.ac.jp/challenges/sources/ICPC/Prelim/1626  

### 問題概要  
長さnの数列{1,2,3...inf}が与えられます。ある区間が存在して、その区間中の要素の総和がkとなるような区間を求めてください。  
解が複数存在する場合、できるだけ小さい要素から始まる区間を出力してください。
---
# 解法
今回は`尺取り法`というアルゴリズムを使って解いていきます。
尺取り法は、「連続した区間でhogeなものを求める」みたいな問題で主に役立ち、今回の問題には適任です。  
まずはアルゴリズムを理解するために、以下の小課題を考えます。
### 小課題
**数列=[1,2,3,4,5,6,7]がある。この数列の連続した区間であって、その総和が15になるようなものを全て求めよ。**  
尺取り法は、右端を伸ばしながら、条件に合わせるように左端を縮める、というものです。最初、区間は左端と右端が両方0であるところから始めます。  
以下、少し冗長ですが、処理を追っていきましょう。  
開始  

| 数列 | 左端 | 右端 | 区間の要素の総和 |  
|:----|:----|:----|:----|  
| 1 2 3 4 5 6 7    | 0| 0 | 0 |  
| <font color="Red">1</font> 2 3 4 5 6 7  | 0 | 1 | 1 |  
|`1 2` 3 4 5 6 7  |0 |2| 3  |  
|`1 2 3` 4 5 6 7  |0 |3 |6|  
|`1 2 3 4` 5 6 7  |0 |4 |10|  
|`1 2 3 4 5` 6 7  |0 |5 |15 (発見!)|  
|1 `2 3 4 5` 6 7  |1 |5 |14|  
|1 `2 3 4 5 6` 7  |1 |6 |20|  
|1 2 `3 4 5 6` 7  |2 |6 |18|  
|1 2 3 `4 5 6` 7  |3 |6 |15 (発見!)|  
|1 2 3 4 `5 6` 7  |4 |6 |11|  
|1 2 3 4 `5 6 7`  |4 |7 |18|  
|1 2 3 4 5 `6 7`  |5 |7 |13|  
|1 2 3 4 5 6 `7`  |6 |7 |7|  
|1 2 3 4 5 6 7    |7 |7 |0|  
終了  

今回の条件は「区間内の要素の総和が15になる」でした。 
* 区間内の総和が15よりも小さければ、右端を伸ばし、sumをその分足す。  
* 区間内の総和が15よりも大きければ、左端を縮めて、sumをその分引く。  
この2つの操作が行われています。  




愚直解はすぐに思い浮かびます。区間の左端と右端をfor文で回して、その総和を毎回計算します。  
~~~
for i=1 to n: //左端
    for j=i+1 to n: //右端
        sum ← 0
        for k=i to j: //区間の要素の和を求める
            sum+=array[k]
        if sum==k :
            print(i,j-i) //kに一致すればok
            return
~~~
しかしこれでは３重ループになってしまい、実行が終わるまでに人類が滅亡してしまいます。O(n<sup>3<sup>)に対してn=10<sup>9<sup>は無謀です。

そこで、


