---
title: 2026暑假做题记录
description: "2026.8"
publishedAt: 2026-08-27
tags:
  - 算法
  - Cpp
  - 数据结构
---
# 2026.8.27
消磨了一个暑假到快结束的时候终于开始复健cpp和数算了。经过几个月agent的工作感觉自己的大脑变得平滑。暑假忙了两个月也没干出什么，有种修为散尽的感觉（瘫）
## [宝藏二叉树](http://cs101.openjudge.cn/practice/24637/)

树形dp。写一半想起来上学期做过。
```cpp
#include<bits/stdc++.h>
using namespace std;
int n;
int main(){
    scanf("%d",&n);
    int dp1[n+1],dp2[n+1],a[n+1];
    memset(dp1,0,sizeof(dp1));//选
    memset(dp2,0,sizeof(dp2));//不选
    for(int i=1;i<=n;i++){
        scanf("%d",&a[i]);
        dp1[i]=a[i];
    }
    for(int i=n;i>=1;i--){
        int l=i<<1,r=i<<1|1;
        if(l<=n){
            dp1[i]+=dp2[l];
            dp2[i]+=max(dp1[l],dp2[l]);
        }
        if(r<=n){
            dp1[i]+=dp2[r];
            dp2[i]+=max(dp1[r],dp2[r]);
        }
    }
    printf("%d",max(dp1[1],dp2[1]));
    return 0;
}
```
## [文本二叉树](http://cs101.openjudge.cn/practice/03720/)
标了m但有点难度。
关键点一个在于星号可以标记是否有左儿子，因此对每个节点增加一个cnt来记录已经处理了几个儿子。另一个在于开一个数组记录最近的第i层的节点。
```cpp
#include<bits/stdc++.h>
using namespace std;
struct TreeNode{
    char val;
    int left=-1;
    int right=-1;
    int cnt=0;//已处理的孩子数
};
TreeNode tree[205];
int n,m;
void preorder(int root){
    if(root==-1) return;
    printf("%c",tree[root].val);
    preorder(tree[root].left);
    preorder(tree[root].right);
}
void inorder(int root){
    if(root==-1) return;
    inorder(tree[root].left);
    printf("%c",tree[root].val);
    inorder(tree[root].right);
}
void postorder(int root){
    if(root==-1) return;
    postorder(tree[root].left);
    postorder(tree[root].right);
    printf("%c",tree[root].val);
}
int main(){
    scanf("%d",&n);
    for(int t=1;t<=n;t++){
        m=0;
        int last[105];//最近的第i层节点
        for(int i=0;i<105;i++){
            last[i]=-1;
        }
        for(int i=1;i<=200;i++){
            tree[i].val=' ';
            tree[i].left=-1;
            tree[i].right=-1;
        }
        int root=-1;
        vector<pair<int,int>> nodes;
        char line[105]=" ";
        while(strcmp(line,"0")!=0){
            scanf("%s",line);
            if(strcmp(line,"0")==0) break;
            int level=0;
            while(level<strlen(line)&&line[level]=='-'){
                level++;
            }
            char val=line[level];
            if(level==0){
                tree[m++]={val};
                root=0;
                last[level]=0;
                continue;
            }
            int parent=last[level-1];
            if(val=='*'){
                tree[parent].cnt++;
            }
            else{
                tree[m++]={val};
                if(tree[parent].cnt==0){
                    tree[parent].left=m-1;
                }
                else{
                    tree[parent].right=m-1;
                }
                tree[parent].cnt++;
                last[level]=m-1;
            }
        }
        preorder(root);
        printf("\n");
        postorder(root);
        printf("\n");
        inorder(root);
        printf("\n\n");
    }
}
```
## [【模板】最近公共祖先（LCA）](https://www.luogu.com.cn/problem/P3379)
复健一下倍增lca
```cpp
#include<bits/stdc++.h>
using namespace std;
int n,m,s;
const int N=1e6+5;
vector<int> e[N];
int f[N][33],dep[N];
void dfs(int u,int fa){
    dep[u]=dep[fa]+1;
    f[u][0]=fa;
    for(auto v:e[u]){
        if(v==fa) continue;
        dfs(v,u);
    }
}
int lca(int x,int y){
    if(dep[x]<dep[y]) swap(x,y);
    for(int i=22;i>=0;i--){
        if(dep[f[x][i]]>=dep[y]) x=f[x][i];
    }
    if(x==y) return x;
    for(int i=22;i>=0;i--){
        if(f[x][i]!=f[y][i]){
            x=f[x][i];
            y=f[y][i];
        }
    }
    return f[x][0];
}
int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cin>>n>>m>>s;
    for(int i=1;i<n;i++){
        int x,y;
        cin>>x>>y;
        e[x].push_back(y);
        e[y].push_back(x);
    }
    dfs(s,0);
    for(int j=1;(1<<j)<=n;j++){
        for(int i=1;i<=n;i++){
            f[i][j]=f[f[i][j-1]][j-1];
        }
    }
    for(int i=1;i<=m;i++){
        int x,y;
        cin>>x>>y;
        cout<<lca(x,y)<<endl;
    }
    return 0;
}
```
## [填充每个节点的下一个右侧节点指针](https://leetcode.cn/problems/populating-next-right-pointers-in-each-node/)
层序遍历
```cpp
#include<bits/stdc++.h>
using namespace std;
// Definition for a Node.
class Node {
public:
    int val;
    Node* left;
    Node* right;
    Node* next;

    Node() : val(0), left(NULL), right(NULL), next(NULL) {}

    Node(int _val) : val(_val), left(NULL), right(NULL), next(NULL) {}

    Node(int _val, Node* _left, Node* _right, Node* _next)
        : val(_val), left(_left), right(_right), next(_next) {}
};


class Solution {
public:
    Node* connect(Node* root) {
        if(root==nullptr) return root;
        queue<Node*> q;
        q.push(root);
        while(!q.empty()){
            int n=q.size();
            for(int i=0;i<n;i++){
                Node *node=q.front();
                q.pop();
                if(i<n-1) node->next=q.front();
                if(node->left) q.push(node->left);
                if(node->right) q.push(node->right);
            }
        }
        return root;
    }
};

// 根据层序数组创建完美二叉树。
Node* buildTree(const vector<int>& values) {
    if (values.empty()) return nullptr;

    vector<Node*> nodes;
    for (int value : values) {
        nodes.push_back(new Node(value));
    }

    for (int i = 0; i < (int)nodes.size(); ++i) {
        int leftIndex = 2 * i + 1;
        int rightIndex = 2 * i + 2;
        if (leftIndex < (int)nodes.size()) {
            nodes[i]->left = nodes[leftIndex];
        }
        if (rightIndex < (int)nodes.size()) {
            nodes[i]->right = nodes[rightIndex];
        }
    }
    return nodes[0];
}

// 按照 LeetCode 的格式，沿 next 指针输出每一层。
void printByNext(Node* root) {
    if (root == nullptr) {
        cout << "[]\n";
        return;
    }

    cout << '[';
    Node* levelStart = root;
    bool first = true;
    while (levelStart != nullptr) {
        for (Node* current = levelStart; current != nullptr;
             current = current->next) {
            if (!first) cout << ',';
            cout << current->val;
            first = false;
        }
        cout << ",#";
        levelStart = levelStart->left;
    }
    cout << "]\n";
}

void deleteTree(Node* root) {
    if (root == nullptr) return;
    deleteTree(root->left);
    deleteTree(root->right);
    delete root;
}

int main(){
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    Solution solution;

    // 示例 1：root = [1,2,3,4,5,6,7]
    Node* root1 = buildTree({1, 2, 3, 4, 5, 6, 7});
    solution.connect(root1);
    printByNext(root1);  // [1,#,2,3,#,4,5,6,7,#]
    deleteTree(root1);

    // 示例 2：root = []
    Node* root2 = buildTree({});
    solution.connect(root2);
    printByNext(root2);  // []
    deleteTree(root2);

    return 0;
}
```
