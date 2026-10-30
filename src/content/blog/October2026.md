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

## [重复的子字符串](https://leetcode.cn/problems/repeated-substring-pattern/)

```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    bool repeatedSubstringPattern(string s) {
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
        if(n%len==0&&len<n) return true;
        return false;
    } 
};
```
## [删除字符串中的所有相邻重复项](https://leetcode.cn/problems/remove-all-adjacent-duplicates-in-string/)

辅助栈存放未被删除的字母，当前字母与栈顶比较。C++的string自带`back()`、`pop_back()`等属性。
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    string removeDuplicates(string s) {
        int n=s.size();
        string stack;
        for(int i=0;i<n;i++){
            if(!stack.empty()&&stack.back()==s[i]) stack.pop_back();
            else stack.push_back(s[i]);
        }
        return stack;
    }
};
```

## [删除子串后的字符串最小长度](https://leetcode.cn/problems/minimum-string-length-after-removing-substrings/)
贪心。与上题类似，使用辅助栈。
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    int minLength(string s) {
        int n=s.size();
        string stack;
        for(int i=0;i<n;i++){
            if(!stack.empty()){
                if(stack.back()=='A'&&s[i]=='B') stack.pop_back();
                else if(stack.back()=='C'&&s[i]=='D') stack.pop_back();
                else stack.push_back(s[i]);
            }
            else stack.push_back(s[i]);
        }
        return stack.size();
    }
};
```

# 2026.10.30
## [N 叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-n-ary-tree/)

递归dfs
```cpp
#include<bits/stdc++.h>
using namespace std;
class Node {
public:
    int val;
    vector<Node*> children;

    Node() {}

    Node(int _val) {
        val = _val;
    }

    Node(int _val, vector<Node*> _children) {
        val = _val;
        children = _children;
    }
};


class Solution {
public:
    int maxDepth(Node* root) {
        if(root==nullptr) return 0;
        int ans=0;
        for(auto child:root->children){
            ans=max(ans,maxDepth(child));
        }
        return ans+1;
    }
};
```

## [省份数量](https://leetcode.cn/problems/number-of-provinces/)

```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
private:
    int fa[205];
public:
    int find(int x){
        if(fa[x]==x) return x;
        fa[x]=find(fa[x]);
        return fa[x];
    }
    void merge(int x,int y){
        int fx=find(x),fy=find(y);
        if(fx!=fy) fa[fx]=fy;
    }
    int findCircleNum(vector<vector<int>>& isConnected) {
        int n=isConnected.size();
        for(int i=0;i<n;i++) fa[i]=i;
        for(int i=0;i<n;i++){
            for(int j=0;j<n;j++){
                if(isConnected[i][j]==1) merge(i,j);
            }
        }
        int ans=0;
        for(int i=0;i<n;i++){
            if(fa[i]==i) ans++;
        }
        return ans;
    }
};
```
## [有效括号的嵌套深度](https://leetcode.cn/problems/maximum-nesting-depth-of-two-valid-parentheses-strings/)

左括号深度加一，右括号深度减一。贪心地把不同层数的括号，交替分给A和B，可以实现深度的最大值最小。
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<int> maxDepthAfterSplit(string seq) {
        int n=seq.size();
        vector<int> ans(n);
        int depth=0;
        for(int i=0;i<n;i++){
            if(seq[i]=='('){
                depth++;
                ans[i]=depth%2;
            }
            else{
                ans[i]=depth%2;
                depth--;
            }
        }
        return ans;
    }
};
```

## [出栈序列统计](http://cs101.openjudge.cn/practice/04077/)

![](https://ik.imagekit.io/Amyxue/Homepage_Amy/blog_WHGo0J4YYp)

```cpp
#include<bits/stdc++.h>
using namespace std;
int main(){
    int n;
    cin>>n;
    int ans=1;
    for(int i=2;i<=n;i++){
        ans=ans*(4*i-2)/(i+1);
    }
    cout<<ans<<endl;
}
```

## [木材加工](http://cs101.openjudge.cn/practice/02774/)

二分答案

```cpp
#include<bits/stdc++.h>
using namespace std;
int main(){
    int n,k;
    cin>>n>>k;
    int a[n];
    for(int i=0;i<n;i++) cin>>a[i];
    int ans=0,l=1,r=*max_element(a,a+n),cnt=0;
    while(l<=r){
        int mid=(l+r)>>1;
        for(int i=0;i<n;i++){
            cnt+=a[i]/mid;
        }
        if(cnt>=k){
            ans=mid;
            l=mid+1;
        }
        else r=mid-1;
        cnt=0;
    }
    cout<<ans<<endl;
}
```

## [反反复复](http://cs101.openjudge.cn/practice/02039/)

```cpp
#include<bits/stdc++.h>
using namespace std;
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    string s;
    cin>>n>>s;
    int m=s.size()/n;
    char a[n][m];
    for(int i=0;i<m;i++){
        for(int j=0;j<n;j++){
            if(i%2==0) a[j][i]=s[i*n+j];
            else a[n-j-1][i]=s[i*n+j];
        }
    }
    for(int i=0;i<n;i++){
        for(int j=0;j<m;j++){
            cout<<a[i][j];
        }
    }
}
```

## [二叉树的中序遍历](https://leetcode.cn/problems/binary-tree-inorder-traversal/)

```cpp
#include<bits/stdc++.h>
using namespace std;
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};
 
class Solution {
public:
    vector<int> ans;
    void inorder(TreeNode* root){
        if(root==nullptr) return;
        inorder(root->left);
        ans.push_back(root->val);
        inorder(root->right);
    }
    vector<int> inorderTraversal(TreeNode* root) {
        inorder(root);
        return ans;
    }
};
```

## [全排列](https://leetcode.cn/problems/permutations/)

```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<vector<int>> ans;
    vector<bool> vis;
    void dfs(int step,vector<int> &nums,vector<int> &res){
        int n=nums.size();
        if(step==n){
            ans.push_back(res);
            return;
        }
        for(int i=0;i<n;i++){
            if(!vis[i]){
                vis[i]=true;
                res.push_back(nums[i]);
                dfs(step+1,nums,res);
                res.pop_back();
                vis[i]=false;
            }
        }
    }
    vector<vector<int>> permute(vector<int>& nums) {
        int n=nums.size();
        for(int i=0;i<n;i++) vis.push_back(false);
        vector<int> res;
        dfs(0,nums,res);
        return ans;
    }
};
```

## [子集](https://leetcode.cn/problems/subsets/)

递归解法-二叉决策树
```cpp
#include<bits/stdc++.h>
using namespace std;
class Solution {
public:
    vector<vector<int>> ans;
    vector<int> res;
    void dfs(int step,vector<int> &nums){
        int n=nums.size();
        if(step==n){
            ans.push_back(res);
            return;
        }
        res.push_back(nums[step]);
        dfs(step+1,nums);
        res.pop_back();
        dfs(step+1,nums);
    }
    vector<vector<int>> subsets(vector<int>& nums) {
        dfs(0,nums);
        return ans;
    }
};
```

## [完美交易窗口](http://cs101.openjudge.cn/practice/30102/)

使用两个单调栈，递减栈求左端点的范围，然后枚举右端点并同时更新递增栈，二分查找左端点的最小值。
```cpp
#include<bits/stdc++.h>
using namespace std;
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin>>n;
    int h[n],high[n];
    for(int i=0;i<n;i++) cin>>h[i];
    for(int i=0;i<n;i++) high[i]=0;
    int ans=0;
    vector<int> dec,inc;
    for(int i=0;i<n;i++){
        while(!dec.empty()&&h[dec.back()]<h[i]) dec.pop_back();
        if(!dec.empty()) high[i]=dec.back();
        else high[i]=-1;
        dec.push_back(i);
    }
    for(int i=0;i<n;i++){
        while(!inc.empty()&&h[inc.back()]>=h[i]) inc.pop_back();
        auto it=upper_bound(inc.begin(),inc.end(),high[i]);
        if(it!=inc.end()) ans=max(ans,i-*it+1);
        inc.push_back(i);
    }
    cout<<ans;
    return 0;
}
```

## [将有序数组转换为二叉搜索树](https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/)

每次选取中间的数作为当前根节点，递归建树。
```cpp
#include<bits/stdc++.h>
using namespace std;
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};
class Solution {
public:
    TreeNode* build(vector<int>& nums,int l,int r){
        if(l>r) return nullptr;
        int mid=(l+r)>>1;
        TreeNode* root=new TreeNode(nums[mid]);
        root->left=build(nums,l,mid-1);
        root->right=build(nums,mid+1,r);
        return root;
    }
    TreeNode* sortedArrayToBST(vector<int>& nums) {
        return build(nums,0,nums.size()-1);
    }
};
```

## [二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/)

```cpp
#include<bits/stdc++.h>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};
class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        vector<vector<int>> result;
        if(root==nullptr) return result;
        queue<TreeNode*> q;
        q.push(root);
        while(!q.empty()){
            int size=q.size();
            vector<int> level;
            for(int i=0;i<size;i++){
                TreeNode* node=q.front();
                q.pop();
                level.push_back(node->val);
                if(node->left!=nullptr) q.push(node->left);
                if(node->right!=nullptr) q.push(node->right);
            }
            result.push_back(level);
        }
        return result;
    }
};
```

## [最深叶节点的最近公共祖先](https://leetcode.cn/problems/lowest-common-ancestor-of-deepest-leaves/)
dfs，往更深的分支搜索，如果深度相同那么当前节点即为最近公共祖先。
```cpp
#include<bits/stdc++.h>
using namespace std;
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

class Solution {
public:
    pair<TreeNode*,int> dfs(TreeNode* root){
        if(root==nullptr) return {nullptr,0};
        auto [lca_l,depth_l]=dfs(root->left);
        auto [lca_r,depth_r]=dfs(root->right);
        if(depth_l==depth_r) return {root,depth_l+1};
        else if(depth_l>depth_r) return {lca_l,depth_l+1};
        else return {lca_r,depth_r+1};
    }
    TreeNode* lcaDeepestLeaves(TreeNode* root) {
        return dfs(root).first;
    }
};
```

## [森林的带度数层次序列存储](http://cs101.openjudge.cn/practice/07161/)

```cpp
#include<bits/stdc++.h>
using namespace std;
struct Node{
    char val;
    int degree;
    vector<int> children;
};
vector<Node> tree;
void dfs(int root){
    for(int i:tree[root].children){
        dfs(i);
    }
    cout<<tree[root].val<<' ';
}
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin>>n;
    for(int i=0;i<n;i++){
        tree.clear();
        char c;
        int d;
        cin>>c>>d;
        tree.push_back({c,d,vector<int>()});
        queue<int> q;
        q.push(0);
        while(!q.empty()){
            int u=q.front();
            q.pop();
            for(int i=0;i<tree[u].degree;i++){
                cin>>c>>d;
                int v=tree.size();
                tree.push_back({c,d,vector<int>()});
                tree[u].children.push_back(v);
                q.push(v);
            }
        }
        dfs(0);
    }

    return 0;
}
```

## [遍历树](http://cs101.openjudge.cn/practice/27928/)

`getline`+`stringstream`读取不定长行；`unorderedmap<int,vector<int>>`保存树；通过保存所有子节点来确定根节点。

```cpp
#include<bits/stdc++.h>
using namespace std;
unordered_map<int,vector<int>> adj;
unordered_set<int> children;
void dfs(int root){
    vector<int> v=adj[root];
    v.push_back(root);
    sort(v.begin(),v.end());
    for(int i:v){
        if(i==root) cout<<i<<endl;
        else dfs(i);
    }
}
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin>>n;
    cin.ignore();
    for(int i=0;i<n;i++){
        string line;
        getline(cin,line);
        stringstream ss(line);
        int u,v;
        ss>>u;
        adj[u];
        while(ss>>v){
            adj[u].push_back(v);
            children.insert(v);
        }
    }
    int root=-1;
    for(auto [i,v]:adj){
        if(children.find(i)==children.end()){
            root=i;
            break;
        }
    }
    dfs(root);
    return 0;
}
```

## [二叉树的序列化与反序列化](https://leetcode.cn/problems/serialize-and-deserialize-binary-tree/)

`stringstream`+`getline`分隔逗号；dfs前序遍历序列化，遇到空节点用井号占位；反序列化同样递归进行。

```cpp
#include<bits/stdc++.h>
using namespace std;
 struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
};
class Codec {
public:
    void dfsSerialize(TreeNode* root,string &s){
        if(root==nullptr){
            s+="#,";
            return;
        }
        s+=to_string(root->val)+',';
        dfsSerialize(root->left,s);
        dfsSerialize(root->right,s);
    }
    // Encodes a tree to a single string.
    string serialize(TreeNode* root) {
        string s;
        dfsSerialize(root,s);
        return s;
    }
    TreeNode* dfsDeserialize(stringstream &ss){
        string str;
        getline(ss,str,',');
        if(str=="#") return nullptr;
        TreeNode* root=new TreeNode(stoi(str));
        root->left=dfsDeserialize(ss);
        root->right=dfsDeserialize(ss);
        return root;
    }
    // Decodes your encoded data to tree.
    TreeNode* deserialize(string data) {
        stringstream ss(data);
        return dfsDeserialize(ss);
    }
};

// Your Codec object will be instantiated and called as such:
// Codec ser, deser;
// TreeNode* ans = deser.deserialize(ser.serialize(root));
```

ddl战士做完所有作业其实已经31号清早了，本来以为是30号截止，一开canvas发现是31号的24点截止，感觉突然如释重负。