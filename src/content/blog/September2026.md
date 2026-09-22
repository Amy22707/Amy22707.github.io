---
title: 26fall数算做题记录 - September
description: 2026.9做题记录
publishedAt: 2026-09-07
tags:
  - 算法
  - Cpp
  - 数据结构
---
<details>
<summary>折叠区小作文</summary>

第三个学期上yhf的课，依旧将复健作为一个学期的开始。自入校以来的几乎每一天，每日选做都始终在Chrome的待办区，大部分时候打开电脑也都有一个或好几个尚未完成的题目窗口。有时思考缓慢，有时急于求成，也不总是在此取得满意的成绩，但总会痴迷于学习一个新的算法，每一次AC弹出时都万分欣喜。总觉得作为一个ai专业的学生我还不够合格，就算vibe其他工作也要古法手搓每一道算法题，也更偏爱算法课程——上了大学依旧像一个oier。当然，作为一个oier，曾经的我更是不够合格。不过以前的事情倒也不再重要，做点虽然很累，但是有用，并且开心的事情，也挺好的。于是享受这一刻——独自一人，随时随地打开电脑，就是一个完整的世界。

</details>

# 2026.9.8
## [Fraction类](http://cs101.openjudge.cn/pctbook/E27653/)
一个callback，同样是上学期的第一道题。此入暑假没有补程设普通班的东西，OOP已经忘光光了……我忏悔。

重载+和<<运算符，由于cout的输出顺序，operator<<写成类外友元函数。
```cpp
#include<bits/stdc++.h>
using namespace std;
class Fraction{
private:
    int numerator;//分子
    int denominator;//分母
    int gcd(int a,int b){
        if(a<0) a=-a;
        if(b<0) b=-b;
        if(a==0) return b;
        while(b!=0){
            int r=a%b;
            a=b;
            b=r;
        }
        return a;
    }
    void simplify(){
        if(denominator<0){
            numerator=-numerator;
            denominator=-denominator;
        }
        int g=gcd(numerator,denominator);
        numerator/=g;
        denominator/=g;
    }
public:
    Fraction(int n=0,int d=1){
        numerator=n;
        denominator=d;
        simplify();
    }
    // Fraction add(Fraction other){
    //     int n=numerator*other.denominator+denominator*other.numerator;
    //     int d=denominator*other.denominator;
    //     return Fraction(n,d);
    // }
    Fraction operator+(Fraction other){
        int n=numerator*other.denominator+denominator*other.numerator;
        int d=denominator*other.denominator;
        return Fraction(n,d);
    }
    // void print(){
    //     if(denominator<0){
    //         numerator=-numerator;
    //         denominator=-denominator;
    //     }
    //     else if(numerator%denominator==0){
    //         cout<<numerator/denominator<<endl;
    //         return;
    //     }
    //     else cout<<numerator<<"/"<<denominator<<endl;
    // }
    friend ostream& operator<<(ostream& os,const Fraction &f){
        if(f.numerator%f.denominator==0){
            os<<f.numerator/f.denominator;
        }
        else os<<f.numerator<<"/"<<f.denominator;
        return os;
    }

};
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int a,b,c,d;
    cin>>a>>b>>c>>d;
    Fraction f1(a,b),f2(c,d);
    Fraction result=f1+f2;
    cout<<result<<endl;
}
```
# 2026.9.8
## [模型整理](http://cs101.openjudge.cn/pctbook/M27300/)
1.map：红黑树，自动按key排序

unordered_map：哈希表，无序

2.字符串查找/分隔：find()。返回类型为size_t
```cpp
size_t pos=s.find('-');
if(pos!=string::npos){
	//操作
}
```
3.getline()输入一整行，但如果与cin混用，在getline之前需要`cin.ignore()`

4.取字符串的最后一位：`.back()`

5.`s.substr(pos,len)//起始位置，字符数`

6.string转double:`stod()`

string转int:`stoi()`

7.遍历map
```cpp
for (auto& [key, value] : myMap) {
	cout << key << ": " << value << endl;
}

for (auto it = myMap.begin(); it != myMap.end(); ++it) {
	cout << it->first << ": " << it->second << endl;
}
```

```cpp
#include<bits/stdc++.h>
using namespace std;
bool cmp(const string& a,const string& b){
    char y1=a.back(),y2=b.back();
    double x1=stod(a.substr(0,a.size()-1)),x2=stod(b.substr(0,b.size()-1));
    if(y1==y2) return x1<x2;
    else if(y1=='M' and y2=='B') return true;
    else return false;
}
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin>>n;
    map<string,vector<string>> a;
    for(int i=0;i<n;i++){
        string s;
        cin>>s;
        size_t pos=s.find('-');
        if(pos!=string::npos){
            string name=s.substr(0,pos);
            string size=s.substr(pos+1);
            a[name].push_back(size);
        }
    }
    for(auto& [name, sizes]:a){
        sort(sizes.begin(),sizes.end(),cmp);
        cout<<name<<": ";
        int n=sizes.size();
        for(int i=0;i<n-1;i++){
            cout<<sizes[i]<<", ";
        }
        cout<<sizes[n-1]<<endl;
    }
    return 0;
}
```

（跳过大量位运算题目）
## [统计单比特整数](https://leetcode.cn/problems/count-monobit-integers/)
1.进制转换
```cpp
cout << oct << x << endl; // 八进制
cout << hex << x << endl; // 十六进制
cout << dec << x << endl; // 十进制
cout << bitset<8>(x) << endl;//固定输出八位
```
2.计算二进制位数
`floor(log2(n))+1`

3.计算二进制中1的个数
```cpp
__builtin_popcount(n)

while (n > 0) {
	n &= (n - 1);  // 清除最低位的 1
	count++;
}
```

```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    int countMonobit(int n) {
        if(n==0) return 1;
        int ans=floor(log2(n))+1;
        if(ans==__builtin_popcount(n)) ans++;
        return ans;
    }
};
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    Solution sol;
    cout << sol.countMonobit(4)<<endl;
    return 0;
}
```
# 2026.9.9
## [颠倒二进制位](https://leetcode.cn/problems/reverse-bits/)
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    int reverseBits(int n) {
        int ans=0;
        for(int i=0;i<32;i++){
            ans<<=1;
            ans|=(n&1);
            n>>=1;
        }
        return ans;
    }
};
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    Solution sol;
    cout << sol.reverseBits(43261596)<<endl;
    return 0;
}

```
## [根据数字二进制下 1 的数目排序](https://leetcode.cn/problems/sort-integers-by-the-number-of-1-bits/)
已放弃思考使用库函数。
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    static bool cmp(int a,int b){
        if(__builtin_popcount(a)==__builtin_popcount(b)) return a<b;
        else return __builtin_popcount(a)<__builtin_popcount(b);
    }
    vector<int> sortByBits(vector<int>& arr) {
        sort(arr.begin(),arr.end(),Solution::cmp);
        return arr;
    }
};
```
## [兔子与樱花](http://cs101.openjudge.cn/practice/05443/)
依旧复健最短路。喜提本班第一个提交。
Dijkstra：单源最短路，贪心(堆优化)+松弛。记录前一个节点以及离它的距离。
```cpp
#include<bits/stdc++.h>
using namespace std;
int p,q,r;
string name[30];
map<string,int> id;
vector<vector<pair<int,int>>> a;
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin>>p;
    a.resize(p);
    for(int i=0;i<p;i++){
        cin>>name[i];
        id[name[i]]=i;
    }
    cin>>q;
    for(int i=0;i<q;i++){
        string x,y;
        int w;
        cin>>x>>y>>w;
        a[id[x]].push_back({id[y],w});
        a[id[y]].push_back({id[x],w});
    }
    cin>>r;
    for(int i=0;i<r;i++){
        string x,y;
        cin>>x>>y;
        int start=id[x],end=id[y];
        vector<int> dist(p,INT_MAX);
        vector<int> pre(p,-1);
        vector<int> predist(p,0);
        vector<bool> vis(p,false);
        priority_queue<pair<int,int>,vector<pair<int,int>>,greater<pair<int,int>>> pq;
        dist[start]=0;
        pq.push({0,start});
        while(!pq.empty()){
            auto [d,u]=pq.top();
            pq.pop();
            if(vis[u]) continue;
            vis[u]=true;
            for(auto [x,w]:a[u]){
                if(dist[x]>dist[u]+w){
                    dist[x]=dist[u]+w;
                    pq.push({dist[x],x});
                    pre[x]=u;
                    predist[x]=w;
                }
            }
        }
        vector<int> path;
        for(int j=end;j!=-1;j=pre[j]){
            path.push_back(j);
        }
        reverse(path.begin(),path.end());
        cout<<name[path[0]];
        for(int i=1;i<path.size();i++){
            int v=path[i];
            cout<<"->("<<predist[v]<<")->"<<name[v];
        }
        cout<<endl;
    }
    return 0;
}
```

Floyd:全图最短路，邻接矩阵+更新距离。同时更新某点到终点的下一步。
```cpp
#include<bits/stdc++.h>
using namespace std;
int p,q,r;
string name[30];
map<string,int> id;
int a[30][30],nxt[30][30];
const int INF=1e9;
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin>>p;
    for(int i=0;i<p;i++){
        cin>>name[i];
        id[name[i]]=i;
    }
    for(int i=0;i<p;i++){
        for(int j=0;j<p;j++){
            a[i][j]=INF;
        }
    }
    for(int i=0;i<p;i++){
        a[i][i]=0;
        nxt[i][i]=i;
    }
    cin>>q;
    for(int i=0;i<q;i++){
        string x,y;
        int w;
        cin>>x>>y>>w;
        int u=id[x],v=id[y];
        a[u][v]=min(a[u][v],w);
        a[v][u]=min(a[v][u],w);
        nxt[u][v]=v;//从i到j的下一步
        nxt[v][u]=u;
    }

    for(int k=0;k<p;k++){
        for(int i=0;i<p;i++){
            for(int j=0;j<p;j++){
                if(a[i][k]==INF||a[k][j]==INF) continue;
                if(a[i][k]+a[k][j]<a[i][j]){
                    a[i][j]=a[i][k]+a[k][j];
                    nxt[i][j]=nxt[i][k];
                }
            }
        }
    }
    cin>>r;
    for(int i=0;i<r;i++){
        string x,y;
        cin>>x>>y;
        int start=id[x],end=id[y];
        cout<<x;
        int cur=start;
        while(cur!=end){
            int z=nxt[cur][end];
            cout<<"->("<<a[cur][z]<<")->"<<name[z];
            cur=z;
        }
        cout<<endl;
    }
    return 0;
}
```
# 2026.9.10
## [完美的爱](http://cs101.openjudge.cn/practice/27141/)
哈希表的妙用。
```cpp
#include<bits/stdc++.h>
using namespace std;
int a[100005];
int pre[100005];
map<int,vector<int>> s;
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin>>n;
    for(int i=1;i<=n;i++){
        cin>>a[i];
        a[i]-=520;
    }
    int ans=0;
    s[0].push_back(0);
    for(int i=1;i<=n;i++){
        pre[i]=pre[i-1]+a[i];
        if(!s[pre[i]].empty()) ans=max(ans,i-s[pre[i]].front());
        s[pre[i]].push_back(i);
    }
    cout<<ans*520<<endl;
    return 0;
}
```
# 2026.9.13
## [拼写检查](http://cs101.openjudge.cn/practice/01035/)
两个字符串一长一短，就用双指针同时跑，遇到不一样的长的那个多走一个。
```cpp
#include<bits/stdc++.h>
using namespace std;
bool check(string a,string b){
    int n=a.size(),m=b.size();
    if(n>m){
        swap(a,b);
        swap(n,m);
    }
    if(m-n>1) return false;
    else if(m-n==1){
        int i=0,j=0,cnt=0;
        while(i<n && j<m){
            if(a[i]==b[j]){
                i++;
                j++;
            }
            else{
                j++;
                cnt++;
            }
        }
        if(cnt>1) return false;
        else return true;
    }
    else{
        int cnt=0;
        for(int i=0;i<n;i++){
            if(a[i]!=b[i]) cnt++;
        }
        if(cnt>1) return false;
        else return true;
    }
}
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string word;
    vector<string> dict;
    while(true){
        cin>>word;
        if(word=="#") break;
        dict.push_back(word);
    }
    int n=dict.size();
    while(true){
        cin>>word;
        if(word=="#") break;
        int status=0;
        vector<string> ans;
        for(string s:dict){
            if(s==word){
                status=1;
                break;
            }
            else if(check(s,word)){
                ans.push_back(s);
                status=2;
            }
        }
        if(status==1) cout<<word<<" is correct\n";
        else{
            cout<<word<<":";
            for(string s:ans) cout<<" "<<s;
            cout<<"\n";
        }
    }
    return 0;
}
```

# 2026.9.15
## [这也是逆序对?](http://cs101.openjudge.cn/practice/31202/)
移项，也就是求两数之和大于零的组数。因此排序，然后双指针，一旦相加大于零那么就说明左指针之后的都大于零，移动右指针。否则移动左指针。
```cpp
#include<bits/stdc++.h>
using namespace std;
int n;
long long ans=0;
int a[200005],b[200005],c[200005];
int main(){
    ios::sync_with_stdio(false);
    cin.tie(0);
    cin>>n;
    for(int i=1;i<=n;i++) cin>>a[i];
    for(int i=1;i<=n;i++) cin>>b[i];
    for(int i=1;i<=n;i++) c[i]=a[i]-b[i];
    int l=1,r=n;
    sort(c+1,c+n+1);
    while(l<r){
        if(c[l]+c[r]>0){
            ans+=r-l;
            r--;
        }
        else l++;
    }
    cout<<ans<<endl;
    return 0;
}
```

# 2026.9.20
## [字符串插入](http://dsa.openjudge.cn/2026dsachapter2/A/)

`.insert(pos,substr)`

```cpp
#include<bits/stdc++.h>
using namespace std;
int main(){
    ios::sync_with_stdio(false);
    cin.tie(0);
    string a,b;
    while(cin>>a>>b){
        char x=0;
        int pos,n=a.size();
        for(int i=0;i<n;i++){
            if(a[i]>x){
                x=a[i];
                pos=i;
            }
        }
        a.insert(pos+1,b);
        cout<<a<<endl;

    }
    return 0;
}
```

## [多项式加法](http://dsa.openjudge.cn/2026dsachapter2/B/)

`map<int,int,greater<int>`可实现按key降序排列。

```cpp
#include<bits/stdc++.h>
using namespace std;
int main(){
    ios::sync_with_stdio(false);
    cin.tie(0);
    int n;
    cin>>n;
    for(int qaq=0;qaq<n;qaq++){
        map<int,int,greater<int>> a;
        int x,y;
        while(cin>>x>>y && y>=0){
            a[y]+=x;
        }
        while(cin>>x>>y && y>=0){
            a[y]+=x;
        }
        for(auto [key,val]:a){
            if(val!=0){
                cout<<"[ "<<val<<" "<<key<<" ] ";
            }
        }
        cout<<endl;
    }

    return 0;
}
```

## [神奇的幻方](http://dsa.openjudge.cn/2026dsachapter2/C/)

```cpp
#include<bits/stdc++.h>
using namespace std;
int main(){
    ios::sync_with_stdio(false);
    cin.tie(0);
    int n;
    cin>>n;
    int a[2*n][2*n];
    int x=0,y=n-1;
    for(int i=0;i<2*n-1;i++){
        for(int j=0;j<2*n-1;j++){
            a[i][j]=0;
        }
    }
    for(int i=1;i<=(2*n-1)*(2*n-1);i++){
        a[x][y]=i;
        x--;
        y++;
        if(x<0&&y>=2*n-1){
            x+=2;
            y--;
        }
        else if(x<0) x=2*n-2;
        else if(y>=2*n-1) y=0;
        else if(a[x][y]!=0){
            x+=2;
            y--;
        }
    }
    for(int i=0;i<2*n-1;i++){
        for(int j=0;j<2*n-1;j++){
            cout<<a[i][j]<<" ";
        }
        cout<<endl;
    }
    return 0;
}
```