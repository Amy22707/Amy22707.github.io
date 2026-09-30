---
title: 26fall数算做题记录 - October
description: 2026.10做题记录
publishedAt: 2026-10-01
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