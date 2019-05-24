# 問題
全チームによるプレーオフ    
URL:https://onlinejudge.u-aizu.ac.jp/challenges/sources/ICPC/Prelim/1627 

### 問題概要
ある表が与えられます。この表にはすでに勝ち負けの情報が書かれており、まだ試合をしていないチームも存在します。まだ埋まっていないマスを適切に埋めるとき、全チームがプレーオフになるような埋め方は何通りあるか求めてください。

---

# 解法
### プレーオフになること
問題文にはプレーオフになる時の図が載っていますが、一般化すると以下のようになります。
* 任意の行について、wonとlostの数が同じである

問題文における正解例の図では、どの行を見てもwonとlostが2個ずつになっています。このような時、プレーオフになります。ここで、「行を見る」とは、表を横向きに見る気持ちで書いていますが、実は列を見ても（＝縦に見ても）良いです。これは対角線を基準として対称になっているからですが、詳しくはあとで出てきます。
|﻿|Team1|Team2|Team3|Team4|Team5|||  
|:--|:--|:--|:--|:--|:--|:--|:--|:--|  
|Team1|X|won|won|lost|lost|→|"won:2| lost:2"|  
|Team2|lost|X|lost|won|won|→|"won:2| lost:2"|  
|Team3|lost|won|X|won|lost|→|"won:2| lost:2"|  
|Team4|won|lost|lost|X|won|→|"won:2| lost:2"|  
|Team5|won|lost|won|lost|X|→|"won:2| lost:2"|  


### まずは制約に驚け
この問題を見たときに一番注目したくなるのは、入力の小ささです。3,5,7,9の奇数しか与えられないと言っています。もしこれが複雑な動的計画法で解ける問題であれば、その計算量は大体O(n)やO(n<sup>2</sup>)程度になるはずです。となれば、出題側からすればその制約は100000や1000程度までは増やせるはずです。でも最大9の奇数しか与えられないとなれば、それくらいの規模でしか現実的に解けないことを教えてくれています。  

このように制約が極端に小さい時は、全探索による解法を視野に入れましょう。

### 全探索？
今、全探索をしたいとします。つまり、全ての空きマスに対してwon,もしくはlostが入る可能性があるので、それを全探索してやろうということです。  
便宜上、wonを表す数字を`1`、lostを表す数字を`0`、まだ試合が行われていない数字を`-1`と置くことにします。

計算量の見積もりを軽くしてみます。チーム数の最大値は9で、成績表は9*9=81マス存在します。ですが、同じチーム同士の試合は行われないので、埋めるべきマスの最大値は81-9=72となります。（実際には、1試合以上の結果は入力で来るのでもう少し減りますが。）この72マスに対してwon,lostの入れ方を全探索すると、O(2<sup>72</sup>)となります。これが最悪計算量で、2<sup>30</sup>が約10<sup>9</sup>であることに注意すれば、2<sup>72</sup>は10<sup>20</sup>程度でしょうか。C++において現実的な計算量はO(10<sup>8</sup>)程度なので、これは現実的ではありません。

ここで使えるのは、勝敗のデータは対角線を境界にして、対称的な構造になっているということです。チーム1がチーム2に勝つことが分かれば、チーム2はチーム1に負けることは勝手に決まります。
もう少し一般化すれば、
* 表のi行j列目に`0`が入ることが分かれば、対角線を挟んだj行i列目には`1`が入ることは自明
* 表のi行j列目に`1`が入ることが分かれば、対角線を挟んだj行i列目には`0`が入ることは自明

となるので、結局全探索するのは対角線で分けられた片側の範囲だけで良いことが分かります。この時のマス目の最大数は36程度で、もう少し頑張れば現実的になりそうです。

### 枝刈り
もう少し計算量を落とすために、枝狩りと呼ばれるものを行います。  
問題文に図示されている表の1行目は、以下のようになっています。便宜上、未対戦の箇所は`-1`で置き換えます。  

||Team1|Team2|Team3|Team4|Team5|  
|:----|:---|:---|:---|:---|:---|  
|Team1|×|-1|-1|lost|lost|  

全探索の最初の一歩として、仮に左から2番目のマスにlostを入れるとします。

||Team1|Team2|Team3|Team4|Team5|  
|:---|:---|:---|:---|:---|:---|  
|Team1|×|lost|-1|lost|lost|  

でも、この時点でプレーオフは成立しないことが分かります。まだ結果を決めていないマスは左から3マス目だけで、ここを仮に`won`にしたとしても、wonとlostの数を一致させることはできないからです。このような場合、他の30マス程度が決まっていなくても、この時点でプレーオフはあり得ないことが分かるので、これ以上探索しても無駄なことが分かります。  
このようにして探索を打ち切っていくことを**枝刈り**と呼びます。  
今回は、「あるマスのwon,lostを決めた時、プレーオフの可能性が無くなればその時点で枝刈りする」として、探索をします。

枝狩りをした場合の計算量は見積もりにくいです。  
でも今回はサンプルが助けてくれます。サンプルの最後のデータセットでは、チーム数9に対して、制約的に最低限である１試合の結果しか与えられていません。これはいわゆる最悪ケースというもので、あり得る一番規模の大きい問題になります。このケースをある程度の速度で解ければ、現実的な解法と呼べるでしょう。  
~~~
//規模が最大のケース
9
1
1 2
~~~

### 実装
実装にあたって、まずは成績表を作成します。これは2次元配列で、`v[i][j] = チームiのチームjに対する試合結果 = {-1 or 1 or 0}`と置きます。最初は`-1`で初期化しておいて、入力の試合結果については`1 or 0`で埋めておきます。  
そして、全探索するために、まだ結果が決まっていないチームの組みを全て配列に格納します。組みの持ち方は`pair<int,int>`でも良いし、適当に構造体を作っても良いです。今回は構造体でやります。  

~~~
struct Point{
    int t1,t2;
    Point(int t1,int t2){
        this->t1=t1;
        this->t2=t2;
    }
};
vector<vector<int>> v(サイズを指定);
vector<Point> points;

int main(){
    int m;cin>>m;
    for(int i=0;i<m;i++){
        int win,lose;
        cin>>win>>lose;
        win--; lose--; //0-index
        v[win][lose]=1;
        v[lose][win]=0;
    }
    //まだ戦っていないところを保存
    for(int i=0;i<n;i++){
        for(int j=i+1;j<n;j++){
            if(v[i][j]==-1)points.push_back(Point{i,j});
        }
    }
}
~~~
適当にPoint構造体を作っておきました。これで2つの値の組を1つの変数で扱えます。  
入力を受けて`0 or 1`で埋めたあと、なおも`-1`で残っているところは未対戦の組です。このようなi,j(i< j)については、points[]に追加します。

この処理で、例えばサンプルの最初のケースでは以下のようにデータを作れます。
~~~
2次元配列：
v[][]=[[X  -1 -1  0  0]
       [-1  X  0 -1 -1]
       [-1  1  X -1 -1]
       [1  -1 -1  X -1]
       [1  -1 -1 -1  X]]

未対戦の組み合わせ(1-index)：
points[]=[(1,2),(1,3),(2,4),(2,5),(3,4),(3,5),(4,5)]
~~~

準備が整ったら全探索を開始します。  
今回はけっこう典型的なTHE・全探索の形で書けるので、まずはコードを眺めましょう。  
~~~
void dfs(int idx){
    if(idx==points.size()){
        if(is_playoff())ans++;
        return;
    }
    //t1が勝ってt2が負ける
    Point point=points[idx];
    v[point.t1][point.t2]=1;
    v[point.t2][point.t1]=0;
    if(will_playoff(point.t1))dfs(idx+1);

    //t1が負けてt2が勝つ
    v[point.t1][point.t2]=0;
    v[point.t2][point.t1]=1;
    if(will_playoff(point.t1))dfs(idx+1);

    v[point.t1][point.t2]=v[point.t2][point.t1]=-1;
    return;
}
~~~
再帰関数を用います。関数名のdfsとは深さ優先探索のことです。  
引数のidxとは、points[]の添字です。  

dfs(idx)を呼ばれたとき、point[idx]について考えています。points[idx]に格納されている2つの整数はまだ未対戦のチーム番号なので、このチームについて勝ち負けの2通りを試します。「試す」というのは、実際に表に値を入れてみることです。試したら、その状態を保持したまま次のidxを試します。

ここで重要なのが枝狩りをしているwill_playoff()の役割です。
~~~
//将来的にプレーオフになる可能性があるか
bool will_playoff(int t1){
    int win=0,lose=0,not_match=0;
    for(int i=0;i<n;i++){
        if(t1==i)continue;       //自分自身とは戦わない
        if(v[t1][i]==1)win++;
        else if(v[t1][i]==0)lose++;
        else not_match++;
    }
    if(abs(win-lose)>not_match)return false; //勝ちと負けの差を埋められるか
    else return true;
}
~~~
チームt1についての行を見て、-1,0,1の数を数えます。プレーオフのためには0と1の数を一致させなければいけないので、-1を使って0と1の差を埋めるイメージです。

プレーオフの判定は全ての行について見るべきだと思うかもしれませんが、1行だけで十分です。あるdfs(idx)を呼んだ時に変化するのはチームpoints[idx].t1の行とチームpoints[idx].t2の行だけで、対称性より、t1の行だけを見て差し支えありません。

このようにして探索を進める中で、idxがpoints[]の(添字的に)最後まで到達したとしましょう。この時、未対戦のチーム全てについて表を埋めたので、表は対角成分をのぞいて全て埋まっていることが保証されます。この時、本当にプレーオフなのかを調べて、そうであれば解答を1増やします。

プレーオフの判定にはis_playoff()を呼びましょう。これは全ての行について(wonの個数)==(lostの個数)であるかを調べます。
~~~
//プレーオフであるかどうか
bool is_playoff(){
    for(int i=0;i<n;i++){
        int win=0,lose=0;
        for(int j=0;j<n;j++){
            if(i==j)continue;
            if(v[i][j]==1)win++;
            else if(v[i][j]==0)lose++;
        }
        if(win!=lose)return false;
    }
    return true;
}
~~~

最後に、main()内ではdfs(0)と呼ぶだけで全探索が行われます。また、それによってansも更新されるので、素直に出力して、問題を解くことができました。
~~~
int main(){
    .............
    dfs(0);
    cout<<ans<<endl;
}
~~~

