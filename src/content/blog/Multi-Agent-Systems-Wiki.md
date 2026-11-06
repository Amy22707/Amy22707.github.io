---
title: Multi-Agent Systems 研究笔记
description: 多 Agent 知识共享、协作评测与推理效率
publishedAt: 2026-11-05
updatedAt: 2026-11-06
tags:
  - Agents
  - Multi_Agent
  - AI_systems
  - LLM_Inference
---
<a id="topic-foundations"></a>
## 1. Foundations

本文收录同一个任务内多个 Agent 或子 Agent 如何传递证据、交付产物和协调执行，以及推理服务如何处理这些协作产生的请求。独立会话共享服务、多候选独立采样和同一任务内的协作分别记载。

- **语义共享** 指 Agent 传递结论、约束、接口约定或原始证据，接收者可以据此改变自己的行动。
- **制品共享** 指 Agent 通过代码补丁、文件、测试日志或可检索记录交接工作。制品存在和另一位 Agent 已读取它是两个事件。
- **计算复用** 指引擎利用已处理的 token 前缀等状态省下重复计算。相同文本能否复用 KV 还取决于模型、前缀位置、token 化和缓存驻留。
- **依赖就绪** 指后续工作所需的产物已经可用。任务可以并发启动，但其中某些操作仍然需要等待前序 Agent 交付。

<a id="topic-measurement"></a>
## 2. Measurement

<a id="paper-2609-32662"></a>
### 2.1 AsynCodeBench：用可执行检查器衡量跨 Agent 依赖

[论文](https://arxiv.org/html/2609.32662v1) · [代码与任务](https://github.com/KaituoZhang/AsynCodeBench)

**主张与研究方法：** 一个子 Agent 完成自己的代码后，另一个子 Agent 仍可能按旧接口开发。仅看汇总测试通过率，很难定位哪一条交接出了问题。AsynCodeBench 把代码任务拆成具有实际依赖的实现单元，用显式有向图和可执行检查器记录上下游是否接通。数据来自 16 个公开仓库的 19 个任务，含 52 条人工核验的有向依赖。

1. **给依赖定义检查。** 例如上游实现新接口，下游调用这个接口。局部检查记录各自工作区的状态，集成检查记录合并后依赖是否满足。
2. **比较五种执行协议。** 单 Agent 完整执行，串行分工与交接，私有工作区异步分工，以及异步分工加只读管理者或允许有限修复的管理者。各协议共享任务包、OpenHands harness 和任务专用 Docker 环境。
3. **沿集成事件记录状态。** ADPR 是最终满足的依赖比例。DRS 是一条依赖首次通过检查的逻辑位置。它使用集成检查点，单 Agent 只有最终工作区，因此只参与最终依赖评估。

**主要结论：** 整体测试通过率较高时，跨组件依赖仍可能大量未解决。更强的单 Agent 编码能力也未必在所有协作协议中转化成更好的依赖闭合。作者以任务平均 token 开销衡量成本，分别用测试通过率和 ADPR 画质量—成本曲线，部分模型的优选协议随质量指标变化。论文未用 DRS 表示真实秒数。

实验覆盖十个开放权重模型，包括 `Qwen/Qwen3.5-9B`、`Qwen/Qwen3.6-27B` 和表中标为 `deepseek/deepseek-v4-flash-0731` 的 DeepSeek-V4-Flash。完整模型列表见附录 D。任务元数据、检查器与复现入口见仓库，主文的推理引擎版本未核实。

<a id="paper-2611-00314"></a>

### 2.2 ParallACT：独立需求下的并行编码与冲突协调

[论文](https://arxiv.org/abs/2611.00314) · [项目页](https://lingyunxiao18.github.io/ParallACT/)

**主张与研究方法：** 两个开发者分别委托 Agent 改同一个仓库。每个 Agent 初始只知道自己的需求，因此即使两份补丁分别通过测试，集成后也可能因接口假设不一致而失败。ParallACT 从 SWE-Bench Pro 的需求和 Docker 镜像出发，加入独立的第二条需求、参考补丁和验收测试，得到 155 对任务。互补型任务要求接口对接，冲突型任务需要协调同一段代码上的两种修改，两个需求最终可以同时满足。

实验比较掌握两条需求的单 Agent、串行交接、私有工作区并行，以及让并行 Agent 使用共享文件或 Redis 传消息或同步。按合并后的联合验收和相对加权 token 成本评分。并行评测允许多种合并方式，有一种通过即记成功。开放权重模型在 Claude Code 或 Codex harness 中运行，由 vLLM 服务，使用 Qwen3.8 Flash Next、DeepSeek V4 Flash 和 GLM 5.3 Flash。闭源对照使用 Claude Code 与 Claude Opus 4.8。

**主要结论：** 加入通信可以部分挽回并行执行的联合通过率，也增加 token 开销。作者观察到消息内容常与任务有关，但可能读得太晚，已经同意的设计也可能未落实。Redis 同步与共享文件同步的通过率差异未达到显著水平。实验覆盖两个 Agent，成本以各配置自己的单 Agent 全知对照为参照。

<a id="topic-sharing"></a>

## 3. Knowledge and Plan Reuse

<a id="paper-2604-24039"></a>
### 3.1 AgenticCache：缓存下一步高层计划，由后台 LLM 校正

[论文](https://proceedings.mlsys.org/paper_files/paper/2026/hash/c66a9db149261435664284a20b6f1d42-Abstract-Conference.html) · [代码与实验日志](https://github.com/hojoonleokim/MLSys26_AgenticCache)

**主张与研究方法：** 具身协作任务里，相邻高层计划常反复出现，例如抓取后运输。每个 Agent 记录前一计划到后一计划的转移和适用状态范围，先用当前状态过滤候选，再结合历史次数与后台确认记录打分。命中后可立即行动，后台 LLM 根据发起时的上下文检查已执行轨迹。反馈到达后，系统强化确认的转移，或在新计划可执行时进行校正。缓存未命中时等待 LLM 规划。

**主要结论：** 有重复计划结构的任务可以减少逐步等待模型。后台校正有延迟，错过交接或争抢资源时，已经发生的环境变化仍需处理。评测使用 TDW-MAT、TDW-COOK、TDW-GAME 和 BEHAVIOR-1K 模拟或图环境，接入 CoELA、COMBO、COHERENT，调用 GPT-5、GPT-5-mini、GPT-5-nano 的 API。主结果包含轨迹预填充，另有空缓存对照。论文记录成功率、执行耗时、token 与费用。

<a id="paper-2610-06481"></a>

### 3.2 AECP：在读取代码时交付知识，在提交代码时检查约定

[论文](https://arxiv.org/abs/2610.06481)

**主张与研究方法：** 多个编码 Agent 并行工作时，普通消息需要接收者自行记住何时使用某条发现，也需要上下游自行检查约定有没有落实。AECP 让一个负责人划分模块，再用两类结构化产物协调并行 worker。

1. **知识产物。** Worker 提交发现、适用的函数或文件，以及可选的可执行证据。Harness 在其他 worker 读取相关代码时把发现随工具结果交付。证据检查失败的发现可以撤回。
2. **契约产物。** 上游声明公开符号和签名。Harness 据此生成可导入的接口桩，让下游能先开发。上游提交实现时，harness 检查可静态判断的接口偏差。若契约改版，使用旧约定的下游需要重新检查自己的实现。

**主要结论：** 在 Doc2Repo、NL2Repo 和 CodeProjectEval 的从规格生成仓库任务中，作者报告 AECP 相比两种团队基线提高隐藏测试通过率、缩短墙钟时间。相比单 Agent，它平均使用更多输出 token。与集成者基线的第一步消融同时引入共享工作区和知识产物，因此该对比无法单独归因于知识投递。主实验使用 AWS Strands Agents SDK，另用 mini-SWE-agent 做一组复核。Claude Opus 4.8、Opus 4.6 与 Sonnet 5 通过 Bedrock 调用，DeepSeek-V4-Flash 与 GLM-5.2 通过 OpenRouter 调用。底层引擎和硬件未披露。

<a id="topic-serving"></a>

## 4. Scheduling and KV

<a id="paper-2405-19888"></a>
### 4.1 Parrot：让服务端看到自然语言工作流的数据依赖

[论文](https://www.usenix.org/conference/osdi24/presentation/lin-chaofan) · [代码](https://github.com/microsoft/ParrotServe)

**主张与研究方法：** 常规请求接口看到的是各自完整的 prompt，应用内部“谁产生这段内容、谁接下来消费”的关系容易丢失。Parrot 用 **Semantic Variable（语义变量）** 显式标记 prompt 里的输入和输出槽位。变量的值可以是自然语言或代码，生产者与消费者通过同一变量建立依赖。

1. **把变量接入请求图。** 编排器提交带变量引用的请求。服务端按引用增量建立数据依赖图，能够识别前序输出、依赖它的请求以及可并行的请求组。
2. **将应用目标传到请求调度。** 以最终输出为观察点分析依赖，把应用完成时间或吞吐目标落实到请求的调度与 batching。
3. **复用共同上下文。** 多个消费者若把同一段动态产生的语义变量安排成共同前缀，系统可以共享对应 KV。Parrot 也实现了面向共享前缀的 attention 计算路径。

例如架构师生成项目目录和接口说明。多个编码 Agent 都需要它，但各自负责不同文件。语义变量把这段共享产物及其消费者显式告诉服务端，让消费者并行、共享共同前缀，也让最后的集成请求知道要等哪些文件。

**主要结论：** 论文 §8.4 在一张 A100 上用 LLaMA 13B 运行 MetaGPT 式的架构师、编码者、审查者工作流，观察到端到端时间与 KV 内存改善。共享前缀、调度批次和专门 attention 实现都贡献了收益。实测比较采用论文当时的 FastChat／vLLM 等基线，主要回答服务效率问题。该组结果没有用现代仓库修复闭环来验证代码正确率。代码公开为 ParrotServe，较大系统实验还包含其他应用与 LLaMA 7B。

<a id="paper-2608-14624"></a>

### 4.2 CacheScout：根据角色转移预测固定前缀的复用

[论文](https://arxiv.org/html/2608.14624v1)

**主张与研究方法：** 一个工作流经常沿相似的角色顺序执行。CacheScout 在线统计 Agent 调用转移，估计哪些角色很快会被调用，把这个信号用于固定角色前缀的驱逐与提前准备。固定前缀包括系统提示、工具说明和示例。

**主要结论：** 角色执行顺序能为缓存调度提供复用信号，提前准备也需要与前台请求竞争资源。论文关注固定前缀服务效率。问答、对话、搜索和编码场景的实验主要比较 TTFT、每轮延迟、吞吐和缓存命中。harness 与引擎的具体版本暂列未核实。

<a id="topic-synthesis"></a>

## 5. Survey

### 论文分类对照

| 论文 | 任务／协作设置 | 共享对象 | 共享与调度机制 | Benchmark／环境 | Harness／隔离 | 引擎／模型 | 评测与主要指标 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| [AsynCodeBench](https://arxiv.org/html/2609.32662v1) | 仓库级编码，单 Agent 对照与多角色协作 | 补丁、依赖证据、管理反馈 | 串行交接、私有并行、只读／可写管理 | AsynCodeBench，仓库快照与 pytest | OpenHands，任务专用 Docker，角色私有工作区 | 引擎未核实，Qwen／DeepSeek 等 | 任务闭环，测试通过率、ADPR、DRS、token 开销 |
| [ParallACT](https://arxiv.org/abs/2611.00314) | 两个独立委托者，同仓库编码 | 消息、补丁、文件编辑历史 | 串行交接／并行私有工作区，文件或 Redis 通信 | SWE-Bench Pro 派生双需求，原任务 Docker 镜像 | Claude Code／Codex，独立改动后合并 | vLLM，Qwen3.8 Flash Next／DeepSeek V4 Flash／GLM 5.3 Flash，另有 Opus 4.8 | 闭环，联合通过率、部分完成、相对加权 token 成本 |
| [AECP](https://arxiv.org/abs/2610.06481) | 从规格生成仓库，负责人和并行 worker | 范围化发现、可执行证据、接口契约 | 按代码访问投递，接口桩与静态检查，改版通知 | Doc2Repo／NL2Repo／CodeProjectEval，空工作区 | AWS Strands，另测 mini-SWE-agent | Bedrock／OpenRouter，底层引擎未披露，Claude／DeepSeek／GLM | 闭环，隐藏测试通过率、墙钟时间、输出 token |
| [AgenticCache](https://proceedings.mlsys.org/paper_files/paper/2026/hash/c66a9db149261435664284a20b6f1d42-Abstract-Conference.html) | 具身任务内多 Agent 协作 | 高层计划与状态条件 | 本地转移缓存，异步确认与校正 | TDW 三任务、BEHAVIOR-1K | CoELA、COMBO、COHERENT | API 后端，GPT-5 系列 | 模拟闭环，成功率、执行时间、token、费用 |
| [Parrot](https://www.usenix.org/conference/osdi24/presentation/lin-chaofan) | 多请求应用，含多角色编码 | 动态文本产物与前缀 KV | 语义变量、依赖图、并行分组与前缀复用 | 多文件编程等应用负载 | Parrot API，编码负载采用 MetaGPT 式分工 | Parrot Engine，编码实验 LLaMA 13B／A100 | 服务实测，端到端时延与 KV 内存 |
| [CacheScout](https://arxiv.org/html/2608.14624v1) | 多角色调用，用户并发设置未明确 | 固定角色前缀 KV | 调用转移预测、驱逐与预取 | QA／对话／搜索／编码负载 | 六角色服务工作流，版本未核实 | 版本未核实 | 服务实验，TTFT、轮延迟、turn/s、命中率 |

**分类口径：** 协作设置记录一个任务内有几个角色、怎样交接。共享对象区分消息、代码制品、计划与模型计算状态。Benchmark 决定任务和验收，harness 控制工作区、工具和消息，引擎执行模型推理。DRS 属于逻辑进度，TTFT 属于请求延迟，两者分别登记。

<a id="materials-index"></a>
## 6. Materials Index

| 论文（原文） | 主要内容 | 本文位置 |
| --- | --- | --- |
| [AsynCodeBench](https://arxiv.org/abs/2609.32662) | 用可执行依赖检查区分局部编码进展与跨 Agent 集成 | [§2.1](#paper-2609-32662) |
| [ParallACT](https://arxiv.org/abs/2611.00314) | 区分单方补丁正确与两个独立需求联合验收 | [§2.2](#paper-2611-00314) |
| [AECP](https://arxiv.org/abs/2610.06481) | Harness 按代码范围投递发现，并检查接口契约 | [§3.2](#paper-2610-06481) |
| [AgenticCache](https://arxiv.org/abs/2604.24039) | 复用高层计划转移，后台模型确认与校正 | [§3.1](#paper-2604-24039) |
| [Parrot](https://www.usenix.org/conference/osdi24/presentation/lin-chaofan) | 暴露文本产物的生产与消费关系，帮助调度和复用 | [§4.1](#paper-2405-19888) |
| [CacheScout](https://arxiv.org/abs/2608.14624) | 学习角色转移，调度固定前缀 KV | [§4.2](#paper-2608-14624) |
