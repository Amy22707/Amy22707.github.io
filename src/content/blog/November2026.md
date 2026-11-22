---
title: 26fall数算做题记录 - November
description: 2026.11做题记录
publishedAt: 2026-11-04
updatedAt: 2026-11-04
tags:
  - 算法
  - Cpp
  - 数据结构
---
# 2026.11.4
快速复习数算期中中……
## [树的镜面映射](http://cs101.openjudge.cn/practice/04082/)

先递归建树，同时以列表保存每个节点的左右孩子。这里需要注意递归的过程中会改变全局变量，因此使用局部变量保存下标避免修改。然后在bfs的过程中同时实现恢复多叉树和镜像。使用左孩子右sibling方法，遍历孩子的过程即为一直访问左孩子的右孩子，直到遇到-1为止。题目要求镜像，只需在bfs的时候，对当前层的所有节点（即前一个节点的孩子）倒一下顺序加入队列即可。
```cpp
#include<bits/stdc++.h>
using namespace std;
struct Node{
    char val;
    vector<int> children;
};
vector<pair<char,int>> nodes;
Node tree[105];
int l[105],r[105];
int pos=0,cnt=0;
int build(){
    char val=nodes[pos].first;
    int type=nodes[pos].second;
    pos++;
    if(val=='$') return -1;
    cnt++;
    int id=cnt;
    tree[cnt]=Node{val,{}};
    if(type==0){
        l[id]=build();
        r[id]=build();
    }
    return id;
}
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin>>n;
    for(int i=0;i<n;i++){
        char c,m;
        cin>>c>>m;
        nodes.push_back({c,m-'0'});
    }
    memset(l,-1,sizeof(l));
    memset(r,-1,sizeof(r));
    int root=build();
    queue<int> q;
    q.push(root);
    bool first=true;
    while(!q.empty()){
        int u=q.front();
        q.pop();
        if(!first) cout<<' ';
        first=false;
        cout<<tree[u].val;
        for(int v=l[u];v!=-1;v=r[v]){
            tree[u].children.push_back(v);
        }
        reverse(tree[u].children.begin(),tree[u].children.end());
        for(int v:tree[u].children) q.push(v);
    }
    return 0;
}
```

# 2026.11.17
## [由中根序列和后根序列重建二叉树](http://dsa.openjudge.cn/2026dsachapter5/A/)

小技巧：提前记录后序遍历每个节点在中序遍历中的位置。

```cpp
#include<bits/stdc++.h>
using namespace std;
const int MAXN=65536;
struct Node{
    int val;
    Node* left;
    Node* right;
    Node(int x){
        val=x;
        left=right=nullptr;
    }
};
vector<int> inorder,postorder;
int pos[MAXN];
Node* build(int inl,int inr,int postl,int postr){
    if(inl>inr) return nullptr;
    int rootval=postorder[postr];
    int k=pos[rootval];
    Node *root=new Node(rootval);
    int leftsize=k-inl;
    root->left=build(inl,k-1,postl,postl+leftsize-1);
    root->right=build(k+1,inr,postl+leftsize,postr-1);
    return root;
}
void preorder(Node* root){
    if(root==nullptr) return;
    cout<<root->val<<" ";
    preorder(root->left);
    preorder(root->right);
}
int main(){
    string line;
    int x;
    getline(cin,line);
    stringstream ss1(line);
    while(ss1>>x) inorder.push_back(x);
    getline(cin,line);
    stringstream ss2(line);
    while(ss2>>x) postorder.push_back(x);
    int n=inorder.size();
    for(int i=0;i<n;i++) pos[inorder[i]]=i;
    Node *root=build(0,n-1,0,n-1);
    preorder(root);
    return 0;
}
```

## [表达式·表达式树·表达式求值](http://dsa.openjudge.cn/2026dsachapter5/B/)

```cpp
#include<bits/stdc++.h>
using namespace std;
int value[26];
struct Node {
    char val;
    Node *left,*right;
    Node(char x) {
        val=x;
        left=right=NULL;
    }
};
int priority(char c) {
    if(c=='+' || c=='-') return 1;
    if(c=='*' || c=='/') return 2;
    return 0;
}
string toPostfix(string s) {
    stack<char> st;
    string res="";
    for(int i=0;i<s.length();i++) {
        char c=s[i];
        if(c>='a' && c<='z') res+=c;
        else if(c=='(') st.push(c);
        else if(c==')') {
            while(st.top()!='(') {
                res+=st.top();
                st.pop();
            }
            st.pop();
        }
        else {
            while(!st.empty() && st.top()!='(' &&
                  priority(st.top())>=priority(c)) {
                res+=st.top();
                st.pop();
            }
            st.push(c);
        }
    }
    while(!st.empty()) {
        res+=st.top();
        st.pop();
    }

    return res;
}
Node* build(string s) {
    stack<Node*> st;

    for(int i=0;i<s.length();i++) {
        char c=s[i];

        if(c>='a' && c<='z') {
            st.push(new Node(c));
        }
        else {
            Node* r=st.top(); st.pop();
            Node* l=st.top(); st.pop();
            Node* root=new Node(c);
            root->left=l;
            root->right=r;
            st.push(root);
        }
    }

    return st.top();
}

int calculate(Node* root) {
    if(root->left==NULL && root->right==NULL)
        return value[root->val-'a'];

    int l=calculate(root->left);
    int r=calculate(root->right);

    if(root->val=='+') return l+r;
    if(root->val=='-') return l-r;
    if(root->val=='*') return l*r;
    return l/r;
}

int height(Node* root) {
    if(root==NULL) return 0;
    return max(height(root->left),height(root->right))+1;
}

void printTree(Node* root,int d,int x,int h,vector<string>& a) {
    if(root==NULL) return;
    a[2*d][x-1]=root->val;
    if(d==h-1) return;
    int offset=1;
    for(int i=0;i<h-d-2;i++) offset*=2;
    if(root->left) {
        a[2*d+1][x-2]='/';
        printTree(root->left,d+1,x-offset,h,a);
    }
    if(root->right) {
        a[2*d+1][x]='\\';
        printTree(root->right,d+1,x+offset,h,a);
    }
}

int main() {
    string s;
    cin>>s;
    int n;
    cin>>n;
    for(int i=0;i<n;i++) {
        char c;
        int x;
        cin>>c>>x;
        value[c-'a']=x;
    }
    string post=toPostfix(s);
    cout<<post<<endl;
    Node* root=build(post);
    int h=height(root);
    int w=(1<<h)-1;
    vector<string> a(2*h-1,string(w,' '));
    printTree(root,0,(w+1)/2,h,a);
    for(int i=0;i<a.size();i++) {
        while(!a[i].empty() && a[i].back()==' ')
            a[i].pop_back();
        cout<<a[i]<<endl;
    }
    cout<<calculate(root)<<endl;
    return 0;
}
```
## [文本二叉树](http://dsa.openjudge.cn/2026dsachapter5/C/)

```cpp
#include<bits/stdc++.h>
using namespace std;
struct Node {
    char val;
    Node *left,*right;
    Node(char x) {
        val=x;
        left=right=NULL;
    }
};
vector<string> a;
int p;
int getDepth(string s) {
    int d=0;
    while(s[d]=='-') d++;
    return d;
}
Node* build(int depth) {
    string s=a[p++];
    Node* root=new Node(s[depth]);
    if(p<a.size() && getDepth(a[p])==depth+1) {
        if(a[p][depth+1]=='*') {
            p++;
        }
        else {
            root->left=build(depth+1);
        }
    }
    if(p<a.size() && getDepth(a[p])==depth+1) {
        root->right=build(depth+1);
    }
    return root;
}
void preorder(Node* root) {
    if(root==NULL) return;

    cout<<root->val;
    preorder(root->left);
    preorder(root->right);
}
void postorder(Node* root) {
    if(root==NULL) return;

    postorder(root->left);
    postorder(root->right);
    cout<<root->val;
}

void inorder(Node* root) {
    if(root==NULL) return;
    inorder(root->left);
    cout<<root->val;
    inorder(root->right);
}

int main() {
    int n;
    cin>>n;
    string s;
    for(int t=0;t<n;t++) {
        a.clear();
        while(cin>>s && s!="0") {
            a.push_back(s);
        }
        p=0;
        Node* root=build(0);
        if(t>0) cout<<endl;
        preorder(root);
        cout<<endl;
        postorder(root);
        cout<<endl;
        inorder(root);
        cout<<endl;
    }
    return 0;
}
```

## [兔子与星空](http://dsa.openjudge.cn/2026dsachapter7/A/)

Kruskal求最小生成树。边从小到大排序，并查集判断是否联通。

```cpp
#include<bits/stdc++.h>
using namespace std;
const int MAXN=30;
struct Edge{
    int u,v,w;
};
vector<Edge> edges;
int fa[MAXN];
int find(int x){
    if(fa[x]==x) return x;
    fa[x]=find(fa[x]);
    return fa[x];
}
void merge(int x,int y){
    int fx=find(x),fy=find(y);
    if(fx!=fy) fa[fx]=fy;
}
bool cmp(Edge a,Edge b){
    return a.w<b.w;
}
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin>>n;
    for(int i=0;i<n;i++){
        char c;
        int k;
        cin>>c>>k;
        for(int j=0;j<k;j++){
            char d;
            int w;
            cin>>d>>w;
            edges.push_back({c-'A',d-'A',w});
        }
        fa[i]=i;
    }
    sort(edges.begin(),edges.end(),cmp);
    int ans=0;
    int cnt=0;
    for(auto [u,v,w]:edges){
        if(find(u)!=find(v)){
            merge(u,v);
            ans+=w;
            cnt++;
        }
        if(cnt==n-1) break;
    }
    cout<<ans<<endl;
    return 0;
}
```

