---
title: Decision Making in AI Robots
description: Advanced decision-making frameworks and algorithms for AI-powered humanoid robots
sidebar_position: 3
tags: [ai, decision-making, planning, robotics, humanoid]
---

# Decision Making in AI Robots

## Overview

Decision making is the cognitive process by which AI-powered humanoid robots select actions to achieve their goals while considering environmental constraints, safety requirements, and multiple competing objectives. This section explores various decision-making frameworks, from classical planning algorithms to modern AI approaches that enable robots to operate effectively in complex, dynamic environments.

## Decision-Making Frameworks

### 1. Classical Planning Approaches

#### State-Space Search
Finding sequences of actions to reach goal states:

```cpp
#include <vector>
#include <queue>
#include <set>
#include <functional>

struct State {
    std::vector<double> configuration;  // Robot configuration (joint angles, etc.)
    std::vector<double> position;       // Position in workspace
    int cost;                          // Path cost from start
    std::vector<int> actions;          // Actions taken to reach this state

    bool operator<(const State& other) const {
        return cost > other.cost;  // For priority queue (min-heap)
    }
};

class StateSpacePlanner {
public:
    struct Action {
        std::function<State(const State&)> transition;
        int cost;
        std::string description;
    };

    std::vector<int> plan(const State& start, const std::function<bool(const State&)>& goal_test,
                         const std::vector<Action>& available_actions) {
        std::priority_queue<State> open_set;
        std::set<std::vector<double>> closed_set;

        open_set.push(start);

        while (!open_set.empty()) {
            State current = open_set.top();
            open_set.pop();

            // Check if we reached the goal
            if (goal_test(current)) {
                return current.actions;
            }

            // Add to closed set to avoid revisiting
            closed_set.insert(current.configuration);

            // Explore neighbors
            for (const auto& action : available_actions) {
                State next = current;
                next = action.transition(next);
                next.cost += action.cost;
                next.actions.push_back(next.actions.size()); // Action ID

                // Check if this state has been visited
                if (closed_set.find(next.configuration) == closed_set.end()) {
                    open_set.push(next);
                }
            }
        }

        return {}; // No path found
    }

private:
    std::vector<Action> actions_;
};

// A* Planning Implementation
class AStarPlanner {
public:
    std::vector<int> plan(const State& start, const State& goal,
                         const std::vector<StateSpacePlanner::Action>& actions) {
        auto heuristic = [goal](const State& s) -> int {
            // Simple Euclidean distance heuristic
            double dist = 0.0;
            for (size_t i = 0; i < s.position.size() && i < goal.position.size(); ++i) {
                dist += (s.position[i] - goal.position[i]) * (s.position[i] - goal.position[i]);
            }
            return static_cast<int>(std::sqrt(dist));
        };

        std::priority_queue<State> open_set;
        std::map<std::vector<double>, int> g_score;  // Cost from start
        std::map<std::vector<double>, int> f_score;  // g_score + heuristic

        open_set.push(start);
        g_score[start.configuration] = 0;
        f_score[start.configuration] = heuristic(start);

        while (!open_set.empty()) {
            State current = open_set.top();
            open_set.pop();

            if (current.configuration == goal.configuration) {
                return current.actions;
            }

            for (const auto& action : actions) {
                State neighbor = action.transition(current);
                int tentative_g_score = g_score[current.configuration] + action.cost;

                if (tentative_g_score < g_score[neighbor.configuration]) {
                    // This path to neighbor is better than any previous one
                    neighbor.actions = current.actions;
                    neighbor.actions.push_back(neighbor.actions.size());

                    g_score[neighbor.configuration] = tentative_g_score;
                    f_score[neighbor.configuration] = tentative_g_score + heuristic(neighbor);

                    open_set.push(neighbor);
                }
            }
        }

        return {}; // No path found
    }
};
```

#### Hierarchical Task Networks (HTN)
Decomposing complex tasks into simpler subtasks:

```cpp
#include <string>
#include <vector>
#include <functional>

struct Task {
    std::string name;
    std::vector<std::string> parameters;
    bool isPrimitive;  // Whether this is a basic action or compound task
};

struct Method {
    std::string task_name;
    std::function<bool(const std::vector<std::string>&, const std::vector<Task>&)> precondition;
    std::vector<Task> subtasks;
};

class HTNPlanner {
public:
    std::vector<Task> plan(const Task& goal_task, const std::vector<Method>& methods) {
        return decomposeTask(goal_task, methods);
    }

private:
    std::vector<Task> decomposeTask(const Task& task, const std::vector<Method>& methods) {
        if (task.isPrimitive) {
            return {task};  // Return primitive task directly
        }

        // Find applicable method
        for (const auto& method : methods) {
            if (method.task_name == task.name && method.precondition(task.parameters, {})) {
                std::vector<Task> plan;

                // Recursively decompose subtasks
                for (const auto& subtask : method.subtasks) {
                    auto subplan = decomposeTask(subtask, methods);
                    plan.insert(plan.end(), subplan.begin(), subplan.end());
                }

                return plan;
            }
        }

        return {};  // No method found
    }
};

// Example: Humanoid robot making coffee
class CoffeeMakingPlanner {
public:
    CoffeeMakingPlanner() {
        setupMethods();
    }

    std::vector<Task> makeCoffeePlan() {
        Task make_coffee = {"make_coffee", {}, false};
        return planner_.plan(make_coffee, methods_);
    }

private:
    void setupMethods() {
        // Method: make_coffee -> fill_kettle + boil_water + make_coffee_with_water
        methods_.push_back({
            "make_coffee",
            [](const std::vector<std::string>& params, const std::vector<Task>& state) {
                return true;  // Always applicable
            },
            {
                {"fill_kettle", {}, false},
                {"boil_water", {}, false},
                {"make_coffee_with_water", {"hot_water"}, false}
            }
        });

        // Method: fill_kettle -> approach_kettle + grasp_kettle + fill_with_water
        methods_.push_back({
            "fill_kettle",
            [](const std::vector<std::string>& params, const std::vector<Task>& state) {
                return true;
            },
            {
                {"approach_kettle", {}, false},
                {"grasp_kettle", {}, false},
                {"fill_with_water", {}, false}
            }
        });
    }

    HTNPlanner planner_;
    std::vector<Method> methods_;
};
```

### 2. Probabilistic Decision Making

#### Markov Decision Processes (MDP)
Modeling decision problems with uncertain outcomes:

```cpp
#include <vector>
#include <map>
#include <random>

class MDPPlanner {
public:
    struct StateTransition {
        int next_state;
        double probability;
        double reward;
    };

    struct Policy {
        std::vector<int> action_for_state;  // Best action for each state
    };

    MDPPlanner(int num_states, int num_actions)
        : num_states_(num_states), num_actions_(num_actions),
          transitions_(num_states, std::vector<std::vector<StateTransition>>(num_actions)),
          rewards_(num_states, std::vector<double>(num_actions, 0.0)),
          values_(num_states, 0.0) {}

    void setTransition(int state, int action, int next_state, double probability, double reward) {
        transitions_[state][action].push_back({next_state, probability, reward});
        rewards_[state][action] = reward;
    }

    Policy solveValueIteration(double gamma = 0.9, double tolerance = 1e-6) {
        std::vector<double> new_values(num_states_, 0.0);

        // Value iteration loop
        bool converged = false;
        while (!converged) {
            for (int s = 0; s < num_states_; ++s) {
                double max_value = -std::numeric_limits<double>::infinity();

                for (int a = 0; a < num_actions_; ++a) {
                    double q_value = 0.0;

                    for (const auto& transition : transitions_[s][a]) {
                        q_value += transition.probability *
                                  (transition.reward + gamma * values_[transition.next_state]);
                    }

                    max_value = std::max(max_value, q_value);
                }

                new_values[s] = max_value;
            }

            // Check for convergence
            double max_diff = 0.0;
            for (int s = 0; s < num_states_; ++s) {
                max_diff = std::max(max_diff, std::abs(new_values[s] - values_[s]));
            }

            values_ = new_values;
            converged = max_diff < tolerance;
        }

        // Extract policy
        Policy policy;
        policy.action_for_state.resize(num_states_);

        for (int s = 0; s < num_states_; ++s) {
            double max_value = -std::numeric_limits<double>::infinity();
            int best_action = 0;

            for (int a = 0; a < num_actions_; ++a) {
                double q_value = 0.0;

                for (const auto& transition : transitions_[s][a]) {
                    q_value += transition.probability *
                              (transition.reward + gamma * values_[transition.next_state]);
                }

                if (q_value > max_value) {
                    max_value = q_value;
                    best_action = a;
                }
            }

            policy.action_for_state[s] = best_action;
        }

        return policy;
    }

private:
    int num_states_;
    int num_actions_;
    std::vector<std::vector<std::vector<StateTransition>>> transitions_;
    std::vector<std::vector<double>> rewards_;
    std::vector<double> values_;
};

// Partially Observable MDP (POMDP) for uncertain sensing
class POMDPPlanner {
public:
    struct Observation {
        int observation_id;
        double probability;  // Probability of this observation given state
    };

    POMDPPlanner(int num_states, int num_actions, int num_observations)
        : num_states_(num_states), num_actions_(num_actions), num_observations_(num_observations) {
        belief_state_.resize(num_states_, 1.0 / num_states_);  // Uniform initial belief
    }

    int selectAction() {
        // In a real POMDP, this would involve complex calculations
        // For this example, we'll use a simplified approach
        return 0;  // Return first action as placeholder
    }

    void updateBelief(const std::vector<double>& observation_probabilities) {
        // Update belief state based on new observation
        for (int s = 0; s < num_states_; ++s) {
            belief_state_[s] *= observation_probabilities[s];
        }

        // Normalize belief state
        double sum = 0.0;
        for (double prob : belief_state_) {
            sum += prob;
        }

        if (sum > 0) {
            for (double& prob : belief_state_) {
                prob /= sum;
            }
        }
    }

    std::vector<double> getBeliefState() const {
        return belief_state_;
    }

private:
    int num_states_;
    int num_actions_;
    int num_observations_;
    std::vector<double> belief_state_;
};
```

#### Bayesian Decision Making
Incorporating uncertainty and prior knowledge:

```cpp
#include <vector>
#include <map>

class BayesianDecisionMaker {
public:
    struct Hypothesis {
        std::string name;
        double prior_probability;
        std::function<double(const std::vector<double>& evidence)> likelihood_function;
    };

    void addHypothesis(const Hypothesis& hypothesis) {
        hypotheses_.push_back(hypothesis);
        updatePosteriors();  // Initialize with prior
    }

    int makeDecision(const std::vector<double>& evidence) {
        // Update posterior probabilities based on evidence
        updatePosteriors(evidence);

        // Calculate expected utilities for each action
        std::vector<double> expected_utilities = calculateExpectedUtilities(evidence);

        // Return action with highest expected utility
        auto max_it = std::max_element(expected_utilities.begin(), expected_utilities.end());
        return std::distance(expected_utilities.begin(), max_it);
    }

    std::vector<double> getHypothesisProbabilities() const {
        std::vector<double> probs;
        for (const auto& h : posteriors_) {
            probs.push_back(h.second);
        }
        return probs;
    }

private:
    void updatePosteriors(const std::vector<double>& evidence = {}) {
        double evidence_probability = 0.0;

        // Calculate P(evidence) = sum of P(evidence|hypothesis) * P(hypothesis)
        for (const auto& h : hypotheses_) {
            double likelihood = h.likelihood_function(evidence);
            double prior = h.prior_probability;
            evidence_probability += likelihood * prior;
        }

        // Calculate posterior probabilities: P(hypothesis|evidence) = P(evidence|hypothesis) * P(hypothesis) / P(evidence)
        posteriors_.clear();
        for (const auto& h : hypotheses_) {
            double likelihood = h.likelihood_function(evidence);
            double prior = h.prior_probability;
            double posterior = (likelihood * prior) / evidence_probability;
            posteriors_[h.name] = posterior;
        }
    }

    std::vector<double> calculateExpectedUtilities(const std::vector<double>& evidence) {
        // This would typically involve a utility function and expected utility calculation
        // For this example, we'll return uniform utilities
        return std::vector<double>(num_actions_, 1.0);
    }

    std::vector<Hypothesis> hypotheses_;
    std::map<std::string, double> posteriors_;
    int num_actions_ = 4;  // Example: 4 possible actions
};
```

### 3. Multi-Objective Decision Making

#### Pareto Optimization
Balancing multiple competing objectives:

```cpp
#include <vector>
#include <algorithm>

struct ObjectiveValue {
    std::vector<double> values;  // Values for each objective
    int action_id;
};

class MultiObjectiveDecisionMaker {
public:
    std::vector<int> findParetoOptimalActions(const std::vector<ObjectiveValue>& candidates) {
        std::vector<int> pareto_optimal;

        for (size_t i = 0; i < candidates.size(); ++i) {
            bool is_dominated = false;

            // Check if candidate i is dominated by any other candidate
            for (size_t j = 0; j < candidates.size(); ++j) {
                if (i != j && dominates(candidates[j], candidates[i])) {
                    is_dominated = true;
                    break;
                }
            }

            if (!is_dominated) {
                pareto_optimal.push_back(candidates[i].action_id);
            }
        }

        return pareto_optimal;
    }

    std::vector<int> selectAction(const std::vector<ObjectiveValue>& candidates,
                                 const std::vector<double>& weights) {
        // Find Pareto optimal actions
        auto pareto_actions = findParetoOptimalActions(candidates);

        if (pareto_actions.empty()) {
            return {};  // No actions available
        }

        // If we need a single action, use weighted sum approach on Pareto frontier
        std::vector<std::pair<double, int>> weighted_scores;  // (score, action_id)

        for (int action_id : pareto_actions) {
            double score = 0.0;
            auto& obj_values = candidates[action_id].values;

            for (size_t k = 0; k < std::min(weights.size(), obj_values.size()); ++k) {
                score += weights[k] * obj_values[k];
            }

            weighted_scores.push_back({score, action_id});
        }

        // Return action with highest weighted score
        auto best = std::max_element(weighted_scores.begin(), weighted_scores.end());
        return {best->second};
    }

private:
    bool dominates(const ObjectiveValue& a, const ObjectiveValue& b) {
        // a dominates b if a is better than or equal to b in all objectives
        // and strictly better in at least one objective
        bool is_better_in_some = false;

        for (size_t i = 0; i < std::min(a.values.size(), b.values.size()); ++i) {
            if (a.values[i] < b.values[i]) {
                // a is worse than b in this objective
                return false;
            }
            if (a.values[i] > b.values[i]) {
                is_better_in_some = true;
            }
        }

        return is_better_in_some;
    }
};

// Example: Humanoid robot balancing multiple objectives
class HumanoidMultiObjective {
public:
    std::vector<int> selectWalkingAction() {
        // Define candidate actions with multiple objectives
        std::vector<ObjectiveValue> candidates;

        // Action 0: Fast walking (high speed, medium stability, high energy)
        candidates.push_back({{0.8, 0.6, -0.7}, 0});  // [speed, stability, energy_effort (negative)]

        // Action 1: Stable walking (low speed, high stability, medium energy)
        candidates.push_back({{0.3, 0.9, -0.5}, 1});

        // Action 2: Balanced walking (medium speed, medium stability, medium energy)
        candidates.push_back({{0.6, 0.7, -0.6}, 2});

        // Define weights based on current situation
        std::vector<double> weights;
        if (isRushed()) {
            weights = {0.6, 0.3, 0.1};  // Prioritize speed
        } else {
            weights = {0.2, 0.6, 0.2};  // Prioritize stability
        }

        return multi_obj_dm_.selectAction(candidates, weights);
    }

private:
    bool isRushed() {
        // Check if robot is in a time-sensitive situation
        return false;  // Placeholder
    }

    MultiObjectiveDecisionMaker multi_obj_dm_;
};
```

## Real-Time Decision Making

### 1. Reactive vs. Deliberative Systems

#### Behavior-Based Architecture
Combining reactive and deliberative components:

```cpp
#include <vector>
#include <memory>
#include <chrono>

class Behavior {
public:
    virtual ~Behavior() = default;
    virtual bool check() = 0;  // Check if behavior should activate
    virtual void action() = 0; // Execute the behavior
    virtual double getPriority() = 0; // Priority for arbitration
    virtual bool isActive() const = 0;
};

class ReactiveBehavior : public Behavior {
public:
    ReactiveBehavior(std::function<bool()> condition_func,
                    std::function<void()> action_func,
                    double priority = 1.0)
        : condition_func_(condition_func), action_func_(action_func), priority_(priority) {}

    bool check() override { return condition_func_(); }
    void action() override { action_func_(); active_ = true; }
    double getPriority() override { return priority_; }
    bool isActive() const override { return active_; }

private:
    std::function<bool()> condition_func_;
    std::function<void()> action_func_;
    double priority_;
    bool active_ = false;
};

class DeliberativeBehavior : public Behavior {
public:
    DeliberativeBehavior(std::function<bool()> condition_func,
                        std::function<void()> action_func,
                        std::chrono::milliseconds min_interval,
                        double priority = 0.5)
        : condition_func_(condition_func), action_func_(action_func),
          min_interval_(min_interval), priority_(priority) {}

    bool check() override {
        auto now = std::chrono::steady_clock::now();
        if (now - last_execution_ >= min_interval_) {
            return condition_func_();
        }
        return false;
    }

    void action() override {
        action_func_();
        last_execution_ = std::chrono::steady_clock::now();
        active_ = true;
    }

    double getPriority() override { return priority_; }
    bool isActive() const override { return active_; }

private:
    std::function<bool()> condition_func_;
    std::function<void()> action_func_;
    std::chrono::milliseconds min_interval_;
    std::chrono::steady_clock::time_point last_execution_ = std::chrono::steady_clock::now();
    double priority_;
    bool active_ = false;
};

class BehaviorArbiter {
public:
    void addBehavior(std::shared_ptr<Behavior> behavior) {
        behaviors_.push_back(behavior);
    }

    void execute() {
        // Find the highest priority active behavior
        std::shared_ptr<Behavior> selected_behavior = nullptr;
        double highest_priority = -1.0;

        for (auto& behavior : behaviors_) {
            if (behavior->check() && behavior->getPriority() > highest_priority) {
                highest_priority = behavior->getPriority();
                selected_behavior = behavior;
            }
        }

        if (selected_behavior) {
            selected_behavior->action();
        }
    }

private:
    std::vector<std::shared_ptr<Behavior>> behaviors_;
};

// Example implementation for humanoid robot
class HumanoidBehaviorSystem {
public:
    HumanoidBehaviorSystem() {
        setupBehaviors();
    }

    void update() {
        arbiter_.execute();
    }

private:
    void setupBehaviors() {
        // High-priority safety behavior
        arbiter_.addBehavior(std::make_shared<ReactiveBehavior>(
            [this]() { return isBalanceThreatened(); },  // Condition
            [this]() { executeBalanceRecovery(); },      // Action
            10.0  // High priority
        ));

        // Medium-priority navigation behavior
        arbiter_.addBehavior(std::make_shared<ReactiveBehavior>(
            [this]() { return shouldAvoidObstacle(); },
            [this]() { executeObstacleAvoidance(); },
            5.0
        ));

        // Lower-priority goal-directed behavior
        arbiter_.addBehavior(std::make_shared<DeliberativeBehavior>(
            [this]() { return hasNavigationGoal(); },
            [this]() { planPathToGoal(); },
            std::chrono::milliseconds(100),  // Execute at most every 100ms
            2.0
        ));
    }

    bool isBalanceThreatened() { return false; /* Placeholder */ }
    void executeBalanceRecovery() { /* Implementation */ }

    bool shouldAvoidObstacle() { return false; /* Placeholder */ }
    void executeObstacleAvoidance() { /* Implementation */ }

    bool hasNavigationGoal() { return false; /* Placeholder */ }
    void planPathToGoal() { /* Implementation */ }

    BehaviorArbiter arbiter_;
};
```

### 2. Decision Trees and Rule-Based Systems

#### Context-Aware Decision Trees
Making decisions based on environmental context:

```cpp
#include <memory>
#include <string>
#include <vector>

struct Context {
    double time_of_day;           // 0-24 hours
    int human_proximity;         // Number of humans nearby
    double battery_level;        // 0.0-1.0
    std::string room_type;       // "kitchen", "living_room", etc.
    bool is_emergency;           // True if emergency situation
};

class DecisionTreeNode {
public:
    virtual ~DecisionTreeNode() = default;
    virtual int makeDecision(const Context& context) = 0;
    virtual bool isLeaf() const = 0;
};

class DecisionNode : public DecisionTreeNode {
public:
    DecisionNode(std::function<bool(const Context&)> condition_func,
                std::shared_ptr<DecisionTreeNode> true_branch,
                std::shared_ptr<DecisionTreeNode> false_branch)
        : condition_func_(condition_func), true_branch_(true_branch), false_branch_(false_branch) {}

    int makeDecision(const Context& context) override {
        if (condition_func_(context)) {
            return true_branch_->makeDecision(context);
        } else {
            return false_branch_->makeDecision(context);
        }
    }

    bool isLeaf() const override { return false; }

private:
    std::function<bool(const Context&)> condition_func_;
    std::shared_ptr<DecisionTreeNode> true_branch_;
    std::shared_ptr<DecisionTreeNode> false_branch_;
};

class ActionNode : public DecisionTreeNode {
public:
    ActionNode(int action_id, std::string action_name)
        : action_id_(action_id), action_name_(action_name) {}

    int makeDecision(const Context& context) override {
        return action_id_;  // Return the action ID
    }

    bool isLeaf() const override { return true; }

private:
    int action_id_;
    std::string action_name_;
};

class ContextDecisionTree {
public:
    ContextDecisionTree() {
        buildTree();
    }

    int decideAction(const Context& context) {
        return root_->makeDecision(context);
    }

private:
    void buildTree() {
        // Build a decision tree for a humanoid robot's behavior selection
        root_ = std::make_shared<DecisionNode>(
            [](const Context& ctx) { return ctx.is_emergency; },
            // Emergency branch: always prioritize safety
            std::make_shared<ActionNode>(99, "EMERGENCY_STOP"),
            // Non-emergency branch: more complex decision making
            std::make_shared<DecisionNode>(
                [](const Context& ctx) { return ctx.battery_level < 0.2; },
                // Low battery: go charge
                std::make_shared<ActionNode>(10, "RETURN_TO_CHARGING_STATION"),
                // Sufficient battery: check other factors
                std::make_shared<DecisionNode>(
                    [](const Context& ctx) { return ctx.human_proximity > 0; },
                    // Humans present: social interaction
                    std::make_shared<DecisionNode>(
                        [](const Context& ctx) { return ctx.time_of_day >= 18.0 && ctx.time_of_day <= 22.0; },
                        // Evening: greeting behavior
                        std::make_shared<ActionNode>(20, "GREET_EVENING"),
                        // Other times: standard greeting
                        std::make_shared<ActionNode>(21, "GREET_STANDARD")
                    ),
                    // No humans: autonomous tasks
                    std::make_shared<ActionNode>(30, "PERFORM_ROUTINE_TASK")
                )
            )
        );
    }

    std::shared_ptr<DecisionTreeNode> root_;
};
```

## Learning-Based Decision Making

### 1. Integration with Learning Systems

#### Policy Gradient Methods
Learning decision policies through interaction:

```cpp
#include <vector>
#include <random>

class PolicyGradientDecisionMaker {
public:
    PolicyGradientDecisionMaker(int state_size, int action_size)
        : state_size_(state_size), action_size_(action_size) {
        // Initialize policy parameters randomly
        policy_params_.resize(action_size * state_size);
        std::random_device rd;
        std::mt19937 gen(rd());
        std::uniform_real_distribution<> dis(-0.1, 0.1);

        for (auto& param : policy_params_) {
            param = dis(gen);
        }
    }

    std::vector<double> getActionProbabilities(const std::vector<double>& state) {
        // Compute action preferences using linear function approximation
        std::vector<double> preferences(action_size_);

        for (int a = 0; a < action_size_; ++a) {
            for (int s = 0; s < state_size_; ++s) {
                preferences[a] += policy_params_[a * state_size_ + s] * state[s];
            }
        }

        // Apply softmax to get probabilities
        double max_pref = *std::max_element(preferences.begin(), preferences.end());

        std::vector<double> exp_preferences(action_size_);
        double sum = 0.0;

        for (int a = 0; a < action_size_; ++a) {
            exp_preferences[a] = exp(preferences[a] - max_pref);  // Subtract max for numerical stability
            sum += exp_preferences[a];
        }

        // Normalize to get probabilities
        std::vector<double> probabilities(action_size_);
        for (int a = 0; a < action_size_; ++a) {
            probabilities[a] = exp_preferences[a] / sum;
        }

        return probabilities;
    }

    int selectAction(const std::vector<double>& state) {
        auto probabilities = getActionProbabilities(state);

        // Sample action according to probabilities
        std::random_device rd;
        std::mt19937 gen(rd());
        std::discrete_distribution<> dist(probabilities.begin(), probabilities.end());

        return dist(gen);
    }

    void updatePolicy(const std::vector<std::vector<double>>& states,
                     const std::vector<int>& actions,
                     const std::vector<double>& rewards) {
        // Simple policy gradient update (REINFORCE algorithm)
        std::vector<double> gradient(policy_params_.size(), 0.0);

        for (size_t i = 0; i < states.size(); ++i) {
            auto probs = getActionProbabilities(states[i]);
            int action = actions[i];
            double reward = rewards[i];

            // Compute gradient for this action
            for (int a = 0; a < action_size_; ++a) {
                double indicator = (a == action) ? 1.0 : 0.0;
                double grad_factor = (indicator - probs[a]) * reward;

                for (int s = 0; s < state_size_; ++s) {
                    gradient[a * state_size_ + s] += grad_factor * states[i][s];
                }
            }
        }

        // Update parameters
        for (size_t i = 0; i < policy_params_.size(); ++i) {
            policy_params_[i] += learning_rate_ * gradient[i] / states.size();
        }
    }

private:
    int state_size_;
    int action_size_;
    std::vector<double> policy_params_;
    double learning_rate_ = 0.01;
};
```

### 2. Multi-Agent Decision Making
Coordinating decisions with other robots or humans:

```cpp
#include <vector>
#include <map>

struct AgentState {
    std::vector<double> position;
    std::vector<double> velocity;
    int current_task;
    double battery_level;
};

class MultiAgentDecisionMaker {
public:
    void registerAgent(int agent_id, const AgentState& state) {
        agent_states_[agent_id] = state;
    }

    std::vector<int> coordinateTasks(const std::vector<int>& available_tasks) {
        // Simple task allocation based on agent capabilities and current states
        std::vector<std::pair<int, int>> task_assignments;  // (agent_id, task_id)

        for (int task : available_tasks) {
            int best_agent = findBestAgentForTask(task);
            if (best_agent != -1) {
                task_assignments.push_back({best_agent, task});

                // Update agent state to reflect task assignment
                agent_states_[best_agent].current_task = task;
            }
        }

        return extractAssignmentVector(task_assignments);
    }

    std::vector<double> computeConsensusAction(const std::vector<std::vector<double>>& agent_actions) {
        // Compute consensus action using weighted averaging
        if (agent_actions.empty()) {
            return {};
        }

        std::vector<double> consensus_action(agent_actions[0].size(), 0.0);
        std::vector<double> weights(agent_actions.size());

        // Calculate weights based on agent reliability (simplified)
        for (size_t i = 0; i < agent_actions.size(); ++i) {
            weights[i] = agent_states_.count(i) ? agent_states_[i].battery_level : 0.5;
        }

        // Compute weighted average
        double total_weight = 0.0;
        for (double w : weights) {
            total_weight += w;
        }

        if (total_weight > 0) {
            for (size_t d = 0; d < consensus_action.size(); ++d) {
                for (size_t i = 0; i < agent_actions.size(); ++i) {
                    consensus_action[d] += agent_actions[i][d] * weights[i];
                }
                consensus_action[d] /= total_weight;
            }
        }

        return consensus_action;
    }

private:
    int findBestAgentForTask(int task) {
        int best_agent = -1;
        double best_score = -1.0;

        for (const auto& agent_state_pair : agent_states_) {
            int agent_id = agent_state_pair.first;
            const auto& state = agent_state_pair.second;

            double score = calculateTaskFitness(state, task);
            if (score > best_score) {
                best_score = score;
                best_agent = agent_id;
            }
        }

        return best_agent;
    }

    double calculateTaskFitness(const AgentState& agent_state, int task) {
        // Calculate how suitable this agent is for the given task
        // This could consider distance, battery level, current load, etc.
        double fitness = agent_state.battery_level;  // Higher battery = higher fitness

        // Add other factors as needed
        if (agent_state.current_task == -1) {
            fitness += 0.2;  // Prefer agents without current tasks
        }

        return fitness;
    }

    std::vector<int> extractAssignmentVector(const std::vector<std::pair<int, int>>& assignments) {
        std::vector<int> result;
        for (const auto& assignment : assignments) {
            result.push_back(assignment.second);  // Return task IDs
        }
        return result;
    }

    std::map<int, AgentState> agent_states_;
};
```

## Decision-Making Under Uncertainty

### 1. Risk Assessment and Management

```cpp
class RiskAwareDecisionMaker {
public:
    struct RiskAssessment {
        double probability;     // Probability of negative outcome
        double severity;        // Severity of negative outcome (0-1)
        double risk_level;      // Combined risk: probability * severity
        std::string type;       // Type of risk
    };

    struct DecisionOption {
        int action_id;
        double expected_utility;
        std::vector<RiskAssessment> risks;
        double safety_margin;
    };

    int selectSafeAction(const std::vector<DecisionOption>& options) {
        // Calculate risk-adjusted utility for each option
        std::vector<std::pair<double, int>> risk_adjusted_utilities;  // (utility, option_index)

        for (size_t i = 0; i < options.size(); ++i) {
            double risk_adjusted_utility = calculateRiskAdjustedUtility(options[i]);
            risk_adjusted_utilities.push_back({risk_adjusted_utility, static_cast<int>(i)});
        }

        // Select option with highest risk-adjusted utility
        auto best_option = std::max_element(risk_adjusted_utilities.begin(), risk_adjusted_utilities.end());
        return options[best_option->second].action_id;
    }

    void setRiskTolerance(double tolerance) {
        risk_tolerance_ = tolerance;  // 0.0 = very risk-averse, 1.0 = risk-neutral
    }

private:
    double calculateRiskAdjustedUtility(const DecisionOption& option) {
        double expected_utility = option.expected_utility;

        // Calculate total risk
        double total_risk = 0.0;
        for (const auto& risk : option.risks) {
            total_risk += risk.risk_level;
        }

        // Apply risk adjustment
        double risk_adjustment = total_risk * (1.0 - risk_tolerance_);
        double safety_penalty = option.safety_margin * risk_tolerance_;

        return expected_utility - risk_adjustment + safety_penalty;
    }

    double risk_tolerance_ = 0.5;  // Default: moderate risk tolerance
};
```

## Implementation Considerations

### 1. Real-Time Constraints

```cpp
class RealTimeDecisionMaker {
public:
    RealTimeDecisionMaker(std::chrono::milliseconds max_decision_time)
        : max_decision_time_(max_decision_time) {}

    int makeDecision(const std::vector<double>& state) {
        auto start_time = std::chrono::steady_clock::now();

        // Perform initial fast decision
        int fast_decision = fastHeuristic(state);

        auto elapsed = std::chrono::steady_clock::now() - start_time;
        auto remaining_time = max_decision_time_ - elapsed;

        if (remaining_time > std::chrono::milliseconds(1)) {
            // Perform more sophisticated decision making if time permits
            auto sophisticated_decision = sophisticatedDecision(state, remaining_time);
            return sophisticated_decision;
        }

        return fast_decision;
    }

private:
    int fastHeuristic(const std::vector<double>& state) {
        // Very fast decision based on simple rules
        if (state.size() > 0 && state[0] > 0.5) {
            return 1;  // Action 1
        }
        return 0;  // Action 0
    }

    int sophisticatedDecision(const std::vector<double>& state,
                             const std::chrono::milliseconds& available_time) {
        // Perform more sophisticated but time-limited decision making
        // This could involve sampling-based methods or limited search
        return fastHeuristic(state);  // Placeholder
    }

    std::chrono::milliseconds max_decision_time_;
};
```

### 2. Integration with ROS2

```cpp
#include <rclcpp/rclcpp.hpp>
#include <std_msgs/msg/string.hpp>
#include <geometry_msgs/msg/pose.hpp>

class DecisionMakingNode : public rclcpp::Node
{
public:
    DecisionMakingNode()
    : Node("decision_making_node")
    {
        // Initialize decision making systems
        initializeDecisionSystems();

        // Create subscribers for relevant information
        sensor_sub_ = this->create_subscription<std_msgs::msg::String>(
            "sensor_data", 10,
            std::bind(&DecisionMakingNode::sensorCallback, this, std::placeholders::_1));

        goal_sub_ = this->create_subscription<std_msgs::msg::String>(
            "goal", 10,
            std::bind(&DecisionMakingNode::goalCallback, this, std::placeholders::_1));

        // Create publisher for decisions
        action_pub_ = this->create_publisher<std_msgs::msg::String>(
            "robot_action", 10);

        // Timer for periodic decision making
        decision_timer_ = this->create_wall_timer(
            std::chrono::milliseconds(100),  // 10 Hz decision cycle
            std::bind(&DecisionMakingNode::decisionCycle, this));
    }

private:
    void initializeDecisionSystems() {
        // Initialize various decision making components
        context_tree_ = std::make_unique<ContextDecisionTree>();
        risk_manager_ = std::make_unique<RiskAwareDecisionMaker>();
        real_time_dm_ = std::make_unique<RealTimeDecisionMaker>(
            std::chrono::milliseconds(50));  // 50ms max decision time
    }

    void sensorCallback(const std_msgs::msg::String::SharedPtr msg) {
        // Process sensor data and update internal state
        last_sensor_data_ = msg->data;
    }

    void goalCallback(const std_msgs::msg::String::SharedPtr msg) {
        // Process goal information
        current_goal_ = msg->data;
    }

    void decisionCycle() {
        // Gather current context
        Context current_context = buildContext();

        // Make decision based on context
        int action_id = context_tree_->decideAction(current_context);

        // Apply risk management if needed
        if (isHighRiskSituation(current_context)) {
            action_id = risk_manager_->selectSafeAction(getAvailableOptions(current_context));
        }

        // Publish decision
        auto action_msg = std_msgs::msg::String();
        action_msg.data = "ACTION_" + std::to_string(action_id);
        action_pub_->publish(action_msg);

        RCLCPP_DEBUG(this->get_logger(), "Decision made: %s", action_msg.data.c_str());
    }

    Context buildContext() {
        Context context;
        // Fill context based on current state, sensor data, goals, etc.
        // This is a simplified example
        context.time_of_day = 12.0;  // Placeholder
        context.human_proximity = 0; // Placeholder
        context.battery_level = 0.8; // Placeholder
        context.room_type = "unknown"; // Placeholder
        context.is_emergency = false;  // Placeholder
        return context;
    }

    bool isHighRiskSituation(const Context& context) {
        // Determine if current situation requires risk-aware decision making
        return context.battery_level < 0.1 || context.is_emergency;
    }

    std::vector<DecisionOption> getAvailableOptions(const Context& context) {
        // Return available decision options based on context
        return {}; // Placeholder
    }

    rclcpp::Subscription<std_msgs::msg::String>::SharedPtr sensor_sub_;
    rclcpp::Subscription<std_msgs::msg::String>::SharedPtr goal_sub_;
    rclcpp::Publisher<std_msgs::msg::String>::SharedPtr action_pub_;
    rclcpp::TimerBase::SharedPtr decision_timer_;

    std::string last_sensor_data_;
    std::string current_goal_;

    std::unique_ptr<ContextDecisionTree> context_tree_;
    std::unique_ptr<RiskAwareDecisionMaker> risk_manager_;
    std::unique_ptr<RealTimeDecisionMaker> real_time_dm_;
};
```

## Next Steps

Continue with the [Getting Started](../getting-started.md) guide to learn how to integrate these decision-making systems into your humanoid robot applications, or explore specific modules on AI Systems, ROS2 Control, Digital Twin Simulation, or AI Robot Brain for more detailed implementation guides.