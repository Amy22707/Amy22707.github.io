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