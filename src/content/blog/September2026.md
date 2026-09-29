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
# 2026.9.28
## [滑动窗口](http://dsa.openjudge.cn/2026chapter3/A/)

一个递增双端队列一个递减双端队列
```cpp
#include<bits/stdc++.h>
using namespace std;
int main(){
    ios::sync_with_stdio(false);
    cin.tie(0);
    int n,k;
    cin>>n>>k;
    int a[n];
    for(int i=0;i<n;i++) cin>>a[i];
    deque<int> minq,maxq;
    for(int i=0;i<k;i++){
        while(!minq.empty() && a[i]<a[minq.back()]) minq.pop_back();
        while(!maxq.empty() && a[i]>a[maxq.back()]) maxq.pop_back();
        minq.push_back(i);
        maxq.push_back(i);
    }
    vector<int> minres,maxres;
    for(int i=k;i<n;i++){
        minres.push_back(a[minq.front()]);
        maxres.push_back(a[maxq.front()]);
        while(!minq.empty() && minq.front()<=i-k) minq.pop_front();
        while(!maxq.empty() && maxq.front()<=i-k) maxq.pop_front();
        while(!minq.empty() && a[i]<a[minq.back()]) minq.pop_back();
        while(!maxq.empty() && a[i]>a[maxq.back()]) maxq.pop_back();
        minq.push_back(i);
        maxq.push_back(i);
    }
    minres.push_back(a[minq.front()]);
    maxres.push_back(a[maxq.front()]);
    for(int i=0;i<=n-k;i++){
        cout<<minres[i]<<" ";
    }
    cout<<endl;
    for(int i=0;i<=n-k;i++){
        cout<<maxres[i]<<" ";
    }
    return 0;
}
```
## [堆栈基本操作](http://dsa.openjudge.cn/2026chapter3/B/)

记录当前的数，需要弹出的数大于当前的数则依次入栈，如果做不到栈顶是当前数则说明序列不合法。
```cpp
#include<bits/stdc++.h>
using namespace std;
int main(){
    ios::sync_with_stdio(false);
    cin.tie(0);
    int n;
    cin>>n;
    int a[n];
    for(int i=0;i<n;i++) cin>>a[i];
    int cur=1;
    stack<int> s;
    bool flag=1;
    vector<string> ans;
    for(int i=0;i<n;i++){
        int x=a[i];
        if(x<1 || x>n){
            cout<<"NO"<<endl;
            flag=0;
            break;
        }
        while(cur<=a[i]){
            ans.push_back("PUSH "+to_string(cur));
            s.push(cur);
            cur++;
        }
        if(s.top()!=a[i]){
            cout<<"NO"<<endl;
            flag=0;
            break;
        }
        else{
            ans.push_back("POP "+to_string(s.top()));
            s.pop();
        }
    }
    if(flag){
        for(int i=0;i<ans.size();i++){
            cout<<ans[i]<<endl;
        }
    }
    return 0;
}
```

# 2026.9.29
## [中缀表达式的值](http://dsa.openjudge.cn/2026chapter3/C/)

1.`string(num,chr)`复制若干遍某个字符，可以char转string

2.`to_string(num)`数字转字符串

3.`cerr<<`标准错误输出流，用于调试，oj评测时不会读

一直wa，然后gpt灵机一动，把long long全部改成int，过了。Python无法通过之题。
```cpp
#include<bits/stdc++.h>
using namespace std;
int priority(char c){
    if(c=='+'||c=='-') return 1;
    if(c=='*'||c=='/') return 2;
    return 0;
}
int main(){
    int N;
    cin>>N;
    while(N--){
        string s;
        cin>>s;
        stack<char> op;
        vector<string> postfix;
        int num=0;
        bool flag=0;
        for(char x:s){
            if(x>='0'&&x<='9'){
                num=num*10+x-'0';
                flag=1;
            }
            else{
                if(flag==1){
                    postfix.push_back(to_string(num));
                    num=0;
                    flag=0;
                }
                if(x=='(') op.push(x);
                else if(x==')'){
                    while(!op.empty()&&op.top()!='('){
                        postfix.push_back(string(1,op.top()));
                        op.pop();
                    }
                    if(!op.empty()) op.pop();
                }
                else{
                    while(!op.empty()&&op.top()!='('&&priority(op.top())>=priority(x)){
                        postfix.push_back(string(1,op.top()));
                        op.pop();
                    }
                    op.push(x);
                }
            }
        }
        if(flag==1) postfix.push_back(to_string(num));
        while(!op.empty()){
            postfix.push_back(string(1,op.top()));
            op.pop();
        }
        // for(string x:postfix) cerr<<x<<" ";
        // cerr<<endl;
        stack<int> st;
        for(string x:postfix){
            if(isdigit(x[0])){
                st.push(stoi(x));
            }
            else{
                int b=st.top();
                st.pop();
                int a=st.top();
                st.pop();
                if(x[0]=='+') st.push(a+b);
                else if(x[0]=='-') st.push(a-b);
                else if(x[0]=='*') st.push(a*b);
                else if(x[0]=='/') st.push(a/b);
            }
        }
        cout<<st.top()<<endl;
    }
}
```

## [相交链表](https://leetcode.cn/problems/intersection-of-two-linked-lists/)

如果两条链表不相交，那么两个指针同时走完a+b；如果相交，那么两个指针走了a+b-c之后，同时到达交点。

```cpp
/* *
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(NULL) {}
 * };
 */
struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(nullptr) {}
};
class Solution {
public:
    ListNode *getIntersectionNode(ListNode *headA, ListNode *headB) {
        if(!headA || !headB) return nullptr;
        ListNode *a=headA,*b=headB;
        while(a!=b){
            if(a==nullptr) a=headB;
            else a=a->next;
            if(b==nullptr) b=headA;
            else b=b->next;
        }
        return a;
    }
};
```



## [反转链表](https://leetcode.cn/problems/reverse-linked-list/)

递归版注意`head.next.next = head` 之后必须 `head.next = None`（否则成环）

递归法，反向操作。每一步的状态即当前节点之后的节点都反向之后，当前的连接更改。


代码（迭代）

```cpp
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        if(head==nullptr ||head->next==nullptr) return head;
        ListNode *prev=nullptr,*cur=head;
        while(cur!=nullptr){
            ListNode *next=cur->next;
            cur->next=prev;
            prev=cur;
            cur=next;
        }
        return prev;
    }
};
```



代码（递归）

```cpp
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        if(head==nullptr||head->next==nullptr) return head;
        ListNode *newhead=reverseList(head->next);
        head->next->next=head;
        head->next=nullptr;
        return newhead;
    }
};
```


## [设计浏览器历史记录](https://leetcode.cn/problems/design-browser-history/)


> 用**双向链表**实现（这是本题的练习目的）。注意 `visit` 之后要把「前进」方向的历史切断。
>
> **思考题（写在思路里）**：本题如果改用顺序表（数组 + 下标）实现，`back(steps)` / `forward(steps)` 的复杂度会变成多少？结合教材 2.4 节「不要使用链表的场合」说说哪种实现更适合这道题。

思路：

若采用顺序表实现，可用数组保存浏览历史，并用下标表示当前位置。`back(steps)` 和 `forward(steps)` 可以直接通过下标加减完成，因此时间复杂度均为 `O(1)`；而双向链表需要逐结点移动，复杂度为 `O(steps)`。本题的主要操作是当前位置的前后移动，并不依赖链表在中间插入、删除结点的优势，因此顺序表实现更简单且效率更高。

```cpp
#include<bits/stdc++.h>
using namespace std;
class BrowserHistory {
private:
    struct Node{
        string url;
        Node* prev;
        Node* next;
        Node(string s):url(s),prev(nullptr),next(nullptr){}
    };
    Node *cur;
public:
    BrowserHistory(string homepage) {
        cur=new Node(homepage);
    }
    
    void visit(string url) {
        Node *newnode=new Node(url);
        cur->next=newnode;
        newnode->prev=cur;
        cur=newnode;        
    }
    
    string back(int steps) {
        while(steps>0 && cur->prev!=nullptr){
            cur=cur->prev;
            steps--;
        }
        return cur->url;
    }
    
    string forward(int steps) {
        while(steps>0 && cur->next!=nullptr){
            cur=cur->next;
            steps--;
        }
        return cur->url;
    }
};
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string homepage="leetcode.com";
    string url="google.com";
    int steps=1;
    BrowserHistory* obj = new BrowserHistory(homepage);
    obj->visit(url);
    string param_2 = obj->back(steps);
    string param_3 = obj->forward(steps);
    cerr<<param_2<<" "<<param_3<<endl;
    delete obj;
    return 0;
}
```

## [LRU缓存](https://leetcode.cn/problems/lru-cache/)

hash table, doubly-linked list, design, https://leetcode.cn/problems/lru-cache/

> 本次作业的重点题。要求 `get` 和 `put` 均为**平均 $O(1)$**，请**手写哈希表 + 双向链表**，先不要直接用 `OrderedDict` / `std::list`（写完之后可以再用库实现对照一遍）。
>
> 两个最常见的坑：① 链表结点里要存 `key`，否则淘汰时删不掉哈希表里那一项；② 淘汰时链表和哈希表必须同步删。

思路：

使用哈希表+双向链表实现。设置空的头指针和尾指针以方便插入和删除。

```cpp
class LRUCache {
private:
    struct Node{
        int key;
        int val;
        Node* prev;
        Node* next;
        Node():key(0),val(0),prev(nullptr),next(nullptr){}
        Node(int k,int v):key(k),val(v),prev(nullptr),next(nullptr){}
    };
    unordered_map<int,Node*> mp;
    Node* head;
    Node* tail;
    int capacity;
    int size=0;
public:
    LRUCache(int capacity) {
        head=new Node();
        tail=new Node();
        head->next=tail;
        tail->prev=head;
        this->capacity=capacity;
    }
    void AddToHead(Node* node){
        node->next=head->next;
        node->prev=head;
        head->next->prev=node;
        head->next=node;
    }
    int get(int key) {
        if(mp.find(key)==mp.end()) return -1;
        Node* node=mp[key];
        node->prev->next=node->next;
        node->next->prev=node->prev;
        AddToHead(node);
        return node->val;
    }
    
    void put(int key, int value) {
        if(mp.find(key)==mp.end()){
            Node* node=new Node(key,value);
            mp[key]=node;
            AddToHead(node);
            size++;
            if(size>capacity){
                Node* removed=tail->prev;
                removed->prev->next=tail;
                tail->prev=removed->prev;
                size--;
                mp.erase(removed->key);
                delete removed;
            }
        }
        else{
            Node* node=mp[key];
            node->val=value;
            node->prev->next=node->next;
            node->next->prev=node->prev;
            AddToHead(node);
        }
    }
};

/**
 * Your LRUCache object will be instantiated and called as such:
 * LRUCache* obj = new LRUCache(capacity);
 * int param_1 = obj->get(key);
 * obj->put(key,value);
 */
```

## [合并两个有序链表](https://leetcode.cn/problems/merge-two-sorted-lists/)

使用dummy节点。

```cpp
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};
class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        ListNode* dummy=new ListNode(-1);
        ListNode *cur=dummy;
        while(list1!=nullptr&&list2!=nullptr){
            if(list1->val<list2->val){
                cur->next=list1;
                list1=list1->next;
            }
            else{
                cur->next=list2;
                list2=list2->next;
            }
            cur=cur->next;
        }
        if(list1!=nullptr) cur->next=list1;
        if(list2!=nullptr) cur->next=list2;
        return dummy->next;
    }
};
```
## [回文链表](https://leetcode.cn/problems/palindrome-linked-list/)


> 进阶要求 $O(n)$ 时间、$O(1)$ 空间：**快慢指针找中点 + 反转后半段 + 逐个比较**。
>
> 请在思路里说明：链表长度为**奇数**和**偶数**时，快慢指针结束后 `slow` 分别停在第几个结点上（建议用 $n = 1,2,3,4$ 手推一遍）。

思路：

链表长度为奇数，slow在最中间的节点；链表长度为偶数，slow在中间靠右的节点。

```cpp
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};
class Solution {
public:
    ListNode* reverse(ListNode* head){
        ListNode *prev=nullptr,*cur=head;
        while(cur!=nullptr){
            ListNode *next=cur->next;
            cur->next=prev;
            prev=cur;
            cur=next;
        }
        head=prev;
        return head;
    }
    bool isPalindrome(ListNode* head) {
        ListNode *slow=head,*fast=head;
        while(fast!=nullptr&&fast->next!=nullptr){
            slow=slow->next;
            fast=fast->next->next;
        }
        ListNode *newhead=reverse(slow);
        ListNode *p1=head,*p2=newhead;
        while(p2!=nullptr){
            if(p1->val!=p2->val) return false;
            p1=p1->next;
            p2=p2->next;
        }
        return true;
    }
};
```
## [狭路相逢](http://cs101.openjudge.cn/practice/30218/)

```cpp
#include<bits/stdc++.h>
using namespace std;
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin>>n;
    int a[n];
    for(int i=0;i<n;i++) cin>>a[i];
    stack<int> s;
    for(int i=0;i<n;i++){
        if(a[i]>0) s.push(a[i]);
        else{
            while(!s.empty()&&s.top()<=abs(a[i])&&s.top()>0){
                a[i]+=s.top();
                s.pop();
            }
            if(a[i]<0){
                if(!s.empty()&&s.top()>abs(a[i])){
                    s.top()+=a[i];
                }
                else s.push(a[i]);
            }
        }
    }
    vector<int> ans;
    int cnt=0;
    while(!s.empty()){
        ans.push_back(s.top());
        s.pop();
        cnt++;
    }
    cout<<cnt<<endl;
    for(int i=ans.size()-1;i>=0;i--) cout<<ans[i]<<" ";
    return 0;
}
```

## [合法出栈序列pub](http://cs101.openjudge.cn/practice/30637/)

贪心。注意混着用getline和cin，需要在cin之后`cin.ignore()`。

```cpp
#include<bits/stdc++.h>
using namespace std;
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string s;
    cin>>s;
    int n=s.size();
    string x;
    cin.ignore();
    while(getline(cin,x)){
        int m=x.size();
        if(m!=n){
            cout<<"NO"<<endl;
            continue;
        }
        bool flag=1;
        stack<char> op;
        int i=0;
        for(char c:x){
            while(i<n&&(op.empty()||op.top()!=c)){
                op.push(s[i]);
                i++;
            }
            if(!op.empty()&&op.top()==c){
                op.pop();
            }
            else{
                flag=0;
                cout<<"NO"<<endl;
                break;
            }
        }
        if(flag==1) cout<<"YES"<<endl;
    }
    return 0;
}
```

## [中序表达式转后序表达式](http://cs101.openjudge.cn/practice/24591/)

Shunting-Yard调度场算法。

```cpp
#include<bits/stdc++.h>
using namespace std;
int priority(char c){
    if(c=='+'||c=='-') return 1;
    if(c=='*'||c=='/') return 2;
    return 0;
}
int main(){
    int N;
    cin>>N;
    while(N--){
        string s;
        cin>>s;
        stack<char> op;
        vector<string> postfix;
        string num="";
        bool flag=0;
        for(char x:s){
            if(x>='0'&&x<='9'||x=='.'){
                num+=x;
                flag=1;
            }
            else{
                if(flag==1){
                    postfix.push_back(num);
                    num="";
                    flag=0;
                }
                if(x=='(') op.push(x);
                else if(x==')'){
                    while(!op.empty()&&op.top()!='('){
                        postfix.push_back(string(1,op.top()));
                        op.pop();
                    }
                    if(!op.empty()) op.pop();
                }
                else{
                    while(!op.empty()&&op.top()!='('&&priority(op.top())>=priority(x)){
                        postfix.push_back(string(1,op.top()));
                        op.pop();
                    }
                    op.push(x);
                }
            }
        }
        if(flag==1) postfix.push_back(num);
        while(!op.empty()){
            postfix.push_back(string(1,op.top()));
            op.pop();
        }
        for(string x:postfix) cout<<x<<" ";
        cout<<endl;
    }
}
```

## [[USACO12MAR] Flowerpot S](https://www.luogu.com.cn/problem/P2698)

单调队列维护滑动窗口最大最小值。

```cpp
#include<bits/stdc++.h>
using namespace std;
struct point{
    int x,y;
}w[100005];
bool cmp(point a,point b){
    if(a.x==b.x) return a.y<b.y;
    return a.x<b.x;
}
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n,d;
    cin>>n>>d;
    for(int i=0;i<n;i++) cin>>w[i].x>>w[i].y;
    sort(w,w+n,cmp);
    deque<int> qmax,qmin;
    int ans=INT_MAX,l=0;
    for(int r=0;r<n;r++){
        while(!qmax.empty()&&w[qmax.back()].y<=w[r].y) qmax.pop_back();
        while(!qmin.empty()&&w[qmin.back()].y>=w[r].y) qmin.pop_back();
        qmax.push_back(r);
        qmin.push_back(r);
        while(!qmax.empty()&&!qmin.empty()&&w[qmax.front()].y-w[qmin.front()].y>=d){
            ans=min(ans,w[r].x-w[l].x);
            if(qmax.front()==l) qmax.pop_front();
            if(qmin.front()==l) qmin.pop_front();
            l++;
        }
    }
    if(ans==INT_MAX) cout<<-1<<endl;
    else cout<<ans<<endl;
    return 0;
}
```

## [Ultra-QuickSort](http://cs101.openjudge.cn/practice/02299/)

```cpp
#include<bits/stdc++.h>
using namespace std;
const int MAXN=500005;
int a[MAXN],b[MAXN];
long long merge(int l,int r){
    if(l==r) return 0;
    int mid=(l+r)>>1;
    long long ans=merge(l,mid)+merge(mid+1,r);
    int i=l,j=mid+1,cur=l;
    while(i<=mid&&j<=r){
        if(a[i]<=a[j]){
            b[cur++]=a[i++];
        }
        else{
            ans+=mid-i+1;
            b[cur++]=a[j++];
        }
    }
    while(i<=mid) b[cur++]=a[i++];
    while(j<=r) b[cur++]=a[j++];
    for(int i=l;i<=r;i++) a[i]=b[i];
    return ans;
}
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    while(cin>>n){
        if(n==0) break;
        memset(a,0,sizeof(a));
        memset(b,0,sizeof(b));
        for(int i=0;i<n;i++) cin>>a[i];
        cout<<merge(0,n-1)<<endl;
    }
    return 0;
}
```

## [逃离紫罗兰监狱](http://cs101.openjudge.cn/practice/29954 )

```cpp
#include<bits/stdc++.h>
using namespace std;
int dx[4]={-1,0,1,0};
int dy[4]={0,1,0,-1};
bool vis[105][105][15];
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int r,c,k;
    cin>>r>>c>>k;
    char a[r][c];
    for(int i=0;i<r;i++){
        for(int j=0;j<c;j++){
            cin>>a[i][j];
        }
    }
    deque<tuple<int,int,int,int>> q;
    for(int i=0;i<r;i++){
        for(int j=0;j<c;j++){
            if(a[i][j]=='S'){
                q.push_back({i,j,0,0});
                vis[i][j][0]=1;
            }
        }
    }
    bool flag=0;
    while(!q.empty()){
        auto [x,y,cur,step]=q.front();
        q.pop_front();
        for(int i=0;i<4;i++){
            int xx=x+dx[i],yy=y+dy[i];
            if(xx<0||xx>=r||yy<0||yy>=c) continue;
            if(a[xx][yy]=='E'){
                flag=1;
                cout<<step+1<<endl;
                return 0;
            }
            else if(a[xx][yy]=='.'&&!vis[xx][yy][cur]){
                vis[xx][yy][cur]=1;
                q.push_back({xx,yy,cur,step+1});
            }
            else if(a[xx][yy]=='#'){
                if(cur<k&&!vis[xx][yy][cur+1]){
                    vis[xx][yy][cur+1]=1;
                    q.push_back({xx,yy,cur+1,step+1});
                }
            }
        }
    }
    if(!flag) cout<<-1<<endl;
    return 0;
}
```

