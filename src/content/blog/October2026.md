---
title: 26fall数算做题记录 - October
description: 2026.10做题记录
publishedAt: 2026-10-01
updatedAt: 2026-10-30
tags:
  - 算法
  - Cpp
  - 数据结构
---
# 2026.10.1

## [花括号展开 II](https://leetcode.cn/problems/brace-expansion-ii/)

连续的块->笛卡尔积，逗号连接的块->并集。递归解析表达式，`parsefactor()`解析小块，而`parseterm()`解析连续的表达式，通过递归调用将已完成的结果与新解析的块作笛卡尔积。`parseexpr()`解析由逗号连接的块，由于拼接的优先级比逗号高，因此先调用`parseterm()`。作笛卡尔积时，第一个块使用空串占位，相当于乘法的1。

```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    string s;
    int pos=0;
    set<string> product(set<string> a,set<string> b){
        set<string> res;
        for(auto x:a){
            for(auto y:b){
                res.insert(x+y);
            }
        }
        return res;
    }
    set<string> parsefactor(){//字母
        set<string> res;
        if(s[pos]=='{'){
            pos++;
            res=parseexpr();
            pos++;
            return res;
        }
        string t="";
        while(pos<s.size()&&(s[pos]>='a'&&s[pos]<='z')){
            t+=s[pos];
            pos++;
        }
        return {t};
    }
    set<string> parseexpr(){//处理，
        set<string> res=parseterm();
        while(pos<s.size()&&s[pos]==','){
            pos++;
            set<string> t=parseterm();
            res.insert(t.begin(),t.end());
        }
        return res;
    }
    set<string> parseterm(){//处理连续拼接
        set<string> res={""};
        while(pos<s.size()&&s[pos]!='}'&&s[pos]!=','){
            set<string> t=parsefactor();
            res=product(res,t);
        }
        return res;
    }
    vector<string> braceExpansionII(string expression) {
        s=expression;
        pos=0;
        set<string> res=parseexpr();
        vector<string> ans(res.begin(),res.end());
        return ans;
    }  
};
```

# 2026.10.4
## [最长有效括号](https://leetcode.cn/problems/longest-valid-parentheses/)

贪心+栈模拟。left记录左括号个数，right记录右括号个数，从左往右扫，相等时说明匹配上了，更新ans，right>left则说明不匹配，清空left和right。再从右往左扫。

```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    int longestValidParentheses(string s) {
        int left=0,right=0,ans=0;
        int n=s.size();
        for(int i=0;i<n;i++){
            if(s[i]=='(') left++;
            else right++;
            if(left==right) ans=max(ans,left+right);
            else if(right>left) left=right=0;
        }
        left=right=0;
        for(int i=n-1;i>=0;i--){
            if(s[i]=='(') left++;
            else right++;
            if(left==right) ans=max(ans,left+right);
            else if(left>right) left=right=0;
        }
        return ans;
    }
};
```

## [括号生成](https://leetcode.cn/problems/generate-parentheses/)

```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<string> res;
    void dfs(int l,int r,string path,int n){
        if(l==n&&r==n){
            res.push_back(path);
            return;
        }
        if(l<n) dfs(l+1,r,path+'(',n);
        if(l>r) dfs(l,r+1,path+')',n);
    }
    vector<string> generateParenthesis(int n) {
        dfs(0,0,"",n);
        return res;
    }
};
```

## [前缀中的周期](http://cs101.openjudge.cn/practice/01961/)

```cpp
#include<bits/stdc++.h>
using namespace std;
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n,t=0;
    while(cin>>n){
        if(n==0) break;
        t++;
        string s;
        cin>>s;
        int nxt[n];
        nxt[0]=-1;
        for(int i=1,j=-1;i<n;i++){
            while(j!=-1&&s[i]!=s[j+1]) j=nxt[j];
            if(s[i]==s[j+1]) j++;
            nxt[i]=j;
        }
        cout<<"Test case #"<<t<<endl;
        for(int i=2;i<=n;i++){
            int len=i-nxt[i-1]-1;
            if(i%len==0&&i!=len) cout<<i<<" "<<i/len<<endl;
        }
        cout<<endl;
    }
    return 0;
}
```

## [旅行售货商问题](http://cs101.openjudge.cn/practice/30201/)

```cpp
#include<bits/stdc++.h>
using namespace std;
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin>>n;
    int cost[n][n];
    for(int i=0;i<n;i++){
        for(int j=0;j<n;j++){
            cin>>cost[i][j];
        }
    }
    int dp[1<<n][n];
    for(int i=0;i<(1<<n);i++){
        for(int j=0;j<n;j++){
            dp[i][j]=INT_MAX;
        }
    }
    dp[1][0]=0;
    for(int i=1;i<(1<<n);i++){
        for(int j=0;j<n;j++){
            if(dp[i][j]==INT_MAX) continue;
            for(int k=0;k<n;k++){
                if(!(i&(1<<k))){
                    int nxt=i|(1<<k);
                    dp[nxt][k]=min(dp[nxt][k],dp[i][j]+cost[j][k]);
                }
            }
        }
    }
    int ans=INT_MAX;
    for(int i=0;i<n;i++){
        if(dp[(1<<n)-1][i]==INT_MAX) continue;
        ans=min(ans,dp[(1<<n)-1][i]+cost[i][0]);
    }
    cout<<ans<<endl;
    return 0;
}
```

# 2026.10.21
## [全在其中](http://dsa.openjudge.cn/2026dsachapter4/A/)
双指针
```cpp
#include<bits/stdc++.h>
using namespace std;
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string s,t;
    while(cin>>s>>t){
        int n=s.size(),m=t.size(),i=0,j=0;
        while(i<n&&j<m){
            if(s[i]==t[j]){
                i++;
                j++;
            }
            else j++;
        }
        if(i==n) cout<<"Yes"<<endl;
        else cout<<"No"<<endl;
    }
    return 0;
}
```
## [字符串乘方](http://dsa.openjudge.cn/2026dsachapter4/B/)

备注：next数组使用这一版教材定义，next[i]表示字符串下标0-i-1的最长公共前后缀长度
```cpp
#include<bits/stdc++.h>
using namespace std;
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string s;
    while(cin>>s&&s!="."){
        int n=s.size();
        int next[n+1];
        next[0]=-1;
        int i=0,j=-1;
        while(i<n){
            if(j==-1||s[i]==s[j]){
                i++;
                j++;
                next[i]=j;
            }
            else j=next[j];
        }
        int len=n-next[n];
        if(n%len==0) cout<<n/len<<endl;
        else cout<<1<<endl;
    }
    return 0;
}
```

## [合格的字符串](http://dsa.openjudge.cn/2026dsachapter4/C/)
1.`to_string()`数字->字符串，`string(1,c)`字符->字符串
2.`tolower()`大写char->小写char，`toupper()`小写char->大写char
```cpp
#include<bits/stdc++.h>
using namespace std;
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin>>n;
    string s;
    string a[n];
    for(int i=0;i<n;i++){
        cin>>a[i];
    }
    cin>>s;
    vector<string> st;
    int i=0,m=s.size();
    while(i<m){
        if(s[i]=='['){
            string temp="";
            i++;
            while(i<m&&s[i]!=']'){
                temp+=tolower(s[i]);
                i++;
            }
            st.push_back(temp);
        }
        else{
            st.push_back(string(1,tolower(s[i])));
        }
        i++;
    }
    m=st.size();
    for(int i=0;i<m;i++){
        cerr<<st[i]<<" ";
    }
    for(int i=0;i<n;i++){
        if(a[i].size()!=m) continue;
        bool flag=true;
        for(int j=0;j<m;j++){
            if(st[j].find(tolower(a[i][j]))==string::npos){
                flag=false;
                break;
            }
        }
        if(flag) cout<<i+1<<" "<<a[i]<<endl;
    }
    return 0;
}
```

# 2026.10.29
## [最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring/)
滑动窗口。建立数组记录需要的字母数量。
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    string minWindow(string s, string t) {
       int n=s.size(),m=t.size();
       int need[128]={0},window[128]={0};
        for(int i=0;i<m;i++){
              need[t[i]]++;
        }
        int l=0,count=0,ans=INT_MAX,start=0;
        for(int r=0;r<n;r++){
            char c=s[r];
            window[c]++;
            if(need[c]>0&&window[c]<=need[c]) count++;
            while(count==m){
                if(r-l+1<ans){
                    ans=r-l+1;
                    start=l;
                }
                char d=s[l];
                window[d]--;
                if(need[d]>0&&window[d]<need[d]) count--;
                l++;
            }
        }
        if(ans==INT_MAX) return "";
        return s.substr(start,ans);
    }
};
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string s="ADOBECODEBANC",t="ABC";
    Solution sol;
    cout<<sol.minWindow(s,t)<<endl;
}
```

## [找出字符串中第一个匹配项的下标](https://leetcode.cn/problems/find-the-index-of-the-first-occurrence-in-a-string/)
KMP
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    int strStr(string haystack, string needle) {
        int n=haystack.size(),m=needle.size();
        int next[m+1];
        next[0]=-1;
        int i=0,j=-1;
        while(i<m){
            if(j==-1||needle[i]==needle[j]){
                i++;
                j++;
                next[i]=j;
            }
            else j=next[j];
        }
        i=0,j=0;
        while(i<n&&j<m){
            if(j==-1||haystack[i]==needle[j]){
                i++;
                j++;
            }
            else j=next[j];
        }
        if(j==m) return i-m;
        return -1;
    }
};
```

