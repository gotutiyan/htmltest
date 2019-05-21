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

| 数列 | 左端の添字 | 右端の添字 | 区間の要素の総和 |  次の操作|  
|:----|:----|:----|:----|:---|  
| 1 2 3 4 5 6 7    | 0| 0 | 0 (開始)| 0<15なので右を伸ばす|  
| <1> 2 3 4 5 6 7  | 0 | 1 | 1 | 1<15なので右を伸ばす|  
|<1 2> 3 4 5 6 7  |0 |2| 3 | 3<15なので右を伸ばす|  
|<1 2 3> 4 5 6 7  |0 |3 |6|6<15なので右を伸ばす|  
|<1 2 3 4> 5 6 7  |0 |4 |10|10<15なので右を伸ばす|
|<1 2 3 4 5> 6 7  |0 |5 |15 (発見!)|15=15なので左を縮める|  
|1 <2 3 4 5> 6 7  |1 |5 |14|14<15なので右を伸ばす|  
|1 <2 3 4 5 6> 7  |1 |6 |20|20>15なので左を縮める|  
|1 2 <3 4 5 6> 7  |2 |6 |18|18>15なので左を縮める|  
|1 2 3 <4 5 6> 7  |3 |6 |15 (発見!)|15=15なので左を縮める|  
|1 2 3 4 <5 6> 7  |4 |6 |11|11<15なので右を伸ばす|  
|1 2 3 4 <5 6 7>  |4 |7 |18|18>15なので左を伸ばす|  
|1 2 3 4 5 <6 7>  |5 |7 |13|13<15なので右を伸ばす|  
|1 2 3 4 5 6 <7>  |6 |7 |7|1<15なので右を伸ばす|  
|1 2 3 4 5 6 7    |7 |7 |0|終了|  

今回は「区間内の要素の総和が15になる」が条件です。  
* 区間内の総和が15よりも小さければ、右端を伸ばし、sumをその分足す。  
* 区間内の総和が15よりも大きければ、左端を縮めて、sumをその分引く。  

この2つの操作が行われています。このように、区間の端を伸び縮みさせる様子がしゃくとり虫の動きに似ていることから、尺取り法との名前がつきました。  

計算量は右端と左端がただ進むだけなので、O(n)です。

さて、本題に戻ります。今回解くべき問題は、小課題を以下のように書き換えれば良いです。  
**数列=[1,2,3,..inf]がある。この数列の連続した区間であって、その総和がdになるようなものを全て求めよ。dは入力で与えられる。**  
根本的なアルゴリズムは変わりません。  
というわけで、実装です。  

### 実装
尺取法の実装は様々ですが、両端のうちどちらかをfor、もう一方をwhileでやるような実装が多いように思います。個人的には右端をforで進めつつ、左端を条件に合うようにwhileで調節するような方法が好きなので、それを紹介します。  
~~~
int d; cin>>d; //入力
int sum=0;
    int left=1;
    for(int right=0;right<1000000000;right++){ //右端を伸ばす
        sum+=right;
        while(sum>d){ //sumがdを超えなくなるまで左端を縮めて調節
            sum-=left;
            left++;
        }
        if(sum==d){ //調節が終わった時に、dと一致していればok
            cout<<left<<" "<<right-left+1<<endl;
            break;
        }
    }
}
~~~  
出力するものは最下層の階数と、その区間の長さなので、それぞれleftとright-left+1で求まることはすぐに分かります。  

最後に、この問題で注意するのは「解が複数存在するときは、一番長い区間を出力する」ことです。しかし、この尺取り法のアルゴリズムでは、特に何も考えなくても勝手にそれを満たしてくれます。  

直感的な証明として、今回考えている数列が単調増加であることを使います。尺取り法は数列の前から徐々に後ろへ進みながら探索を進めるものでした。そして、単調増加の数列においては、このことは「より小さい値で構成された区間から見ている」と言い変えても問題ありません。より小さい要素が集まる区間では、それだけ多くの要素数を集めないと大きな数になれないので、必然的に最初に見つけた区間が最長の区間と言えます。  
例えば、小課題では目的の区間として[1,2,3,4,5]と[4,5,6]が見つかりました。これは[1,2,3,4,5]を、[1,3]と[2,4]と[5]に分けて、各々足せば[4,6,5]になり、偶然連続する整数列になっていたに過ぎません。あとで見つかる区間になるほど、それまでに見つけた区間の適当な要素を足し合わせたものになっているので、要素数も減ります。要素数だけ見れば、[1,2,3,4,5]にはどうやっても勝てないことは直感的に分かるでしょう。




