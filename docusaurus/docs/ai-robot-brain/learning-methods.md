---
title: Learning Methods for AI Robots
description: Exploration of machine learning techniques and algorithms for AI-powered humanoid robots
sidebar_position: 2
tags: [ai, machine-learning, reinforcement-learning, robotics, humanoid]
---

# Learning Methods for AI Robots

## Overview

Learning is a fundamental capability for AI-powered humanoid robots, enabling them to adapt to new situations, improve performance over time, and acquire new skills. This section explores various learning methods suitable for humanoid robotics applications, from classical machine learning to modern deep learning approaches.

## Classification of Learning Methods

### 1. Supervised Learning
Learning from labeled examples to make predictions on new data:

```cpp
#include <vector>
#include <algorithm>
#include <cmath>

class SupervisedLearner {
public:
    // Support Vector Machine implementation for humanoid applications
    class SVM {
    public:
        void train(const std::vector<std::vector<double>>& X, const std::vector<int>& y) {
            X_train_ = X;
            y_train_ = y;
            // Simplified SVM training using coordinate descent
            trainSVM();
        }

        int predict(const std::vector<double>& x) {
            double decision = 0.0;
            for (size_t i = 0; i < X_train_.size(); ++i) {
                decision += alphas_[i] * y_train_[i] * kernel(x, X_train_[i]);
            }
            decision += bias_;
            return decision > 0 ? 1 : -1;
        }

    private:
        void trainSVM() {
            // Initialize alphas and bias
            alphas_.assign(X_train_.size(), 0.0);
            bias_ = 0.0;

            // Simple coordinate descent training
            for (int epoch = 0; epoch < 1000; ++epoch) {
                for (size_t i = 0; i < X_train_.size(); ++i) {
                    double prediction = 0.0;
                    for (size_t j = 0; j < X_train_.size(); ++j) {
                        prediction += alphas_[j] * y_train_[j] * kernel(X_train_[i], X_train_[j]);
                    }
                    prediction += bias_;

                    double error = prediction - y_train_[i];
                    double alpha_old = alphas_[i];

                    // Update alpha with constraints
                    alphas_[i] = std::max(0.0, alphas_[i] - learning_rate_ * error * y_train_[i]);
                    alphas_[i] = std::min(C_, alphas_[i]);

                    // Update bias
                    bias_ -= learning_rate_ * error;
                }
            }
        }

        double kernel(const std::vector<double>& x1, const std::vector<double>& x2) {
            // RBF kernel
            double sum = 0.0;
            for (size_t i = 0; i < x1.size(); ++i) {
                sum += (x1[i] - x2[i]) * (x1[i] - x2[i]);
            }
            return exp(-gamma_ * sum);
        }

        std::vector<std::vector<double>> X_train_;
        std::vector<int> y_train_;
        std::vector<double> alphas_;
        double bias_;
        double learning_rate_ = 0.01;
        double C_ = 1.0;  // Regularization parameter
        double gamma_ = 0.1;  // RBF kernel parameter
    };

    // Neural Network implementation for complex pattern recognition
    class NeuralNetwork {
    public:
        NeuralNetwork(const std::vector<int>& layers) : layers_(layers) {
            initializeWeights();
        }

        std::vector<double> forward(const std::vector<double>& input) {
            auto activations = input;

            for (size_t i = 0; i < weights_.size(); ++i) {
                activations = applyLayer(activations, weights_[i], biases_[i]);
            }

            return activations;
        }

        void train(const std::vector<std::vector<double>>& X, const std::vector<std::vector<double>>& y, int epochs) {
            for (int epoch = 0; epoch < epochs; ++epoch) {
                for (size_t i = 0; i < X.size(); ++i) {
                    auto output = forward(X[i]);
                    auto error = calculateError(output, y[i]);
                    backpropagate(X[i], y[i], error);
                }
            }
        }

    private:
        void initializeWeights() {
            for (size_t i = 0; i < layers_.size() - 1; ++i) {
                std::vector<std::vector<double>> layer_weights(layers_[i + 1], std::vector<double>(layers_[i]));
                std::vector<double> layer_biases(layers_[i + 1]);

                for (auto& row : layer_weights) {
                    for (auto& weight : row) {
                        weight = (double)rand() / RAND_MAX * 2 - 1; // Random weights between -1 and 1
                    }
                }

                for (auto& bias : layer_biases) {
                    bias = (double)rand() / RAND_MAX * 2 - 1;
                }

                weights_.push_back(layer_weights);
                biases_.push_back(layer_biases);
            }
        }

        std::vector<double> applyLayer(const std::vector<double>& input,
                                      const std::vector<std::vector<double>>& weights,
                                      const std::vector<double>& biases) {
            std::vector<double> output(weights.size());

            for (size_t i = 0; i < weights.size(); ++i) {
                double sum = biases[i];
                for (size_t j = 0; j < input.size(); ++j) {
                    sum += weights[i][j] * input[j];
                }
                output[i] = sigmoid(sum);
            }

            return output;
        }

        double sigmoid(double x) {
            return 1.0 / (1.0 + exp(-x));
        }

        std::vector<double> calculateError(const std::vector<double>& output, const std::vector<double>& target) {
            std::vector<double> error(output.size());
            for (size_t i = 0; i < output.size(); ++i) {
                error[i] = target[i] - output[i];
            }
            return error;
        }

        void backpropagate(const std::vector<double>& input,
                          const std::vector<double>& target,
                          const std::vector<double>& initial_error) {
            // Simplified backpropagation implementation
            // In practice, this would involve computing gradients layer by layer
        }

        std::vector<int> layers_;
        std::vector<std::vector<std::vector<double>>> weights_;
        std::vector<std::vector<double>> biases_;
    };

private:
    SVM svm_;
    NeuralNetwork nn_{std::vector<int>{4, 8, 4}};  // Example: 4 inputs, 8 hidden, 4 outputs
};
```

### 2. Unsupervised Learning
Discovering patterns in unlabeled data:

```cpp
#include <vector>
#include <random>
#include <limits>

class UnsupervisedLearner {
public:
    // K-Means clustering for grouping similar behaviors
    class KMeans {
    public:
        KMeans(int k, int max_iters = 100) : k_(k), max_iters_(max_iters) {}

        std::vector<int> fit(const std::vector<std::vector<double>>& data) {
            if (data.empty()) return {};

            // Initialize centroids randomly
            initializeCentroids(data);

            for (int iter = 0; iter < max_iters_; ++iter) {
                // Assign points to nearest centroid
                auto labels = assignLabels(data);

                // Update centroids
                updateCentroids(data, labels);

                // Check for convergence
                if (isConverged(data, labels)) {
                    break;
                }
            }

            return assignLabels(data);  // Return final assignments
        }

        std::vector<std::vector<double>> getCentroids() const {
            return centroids_;
        }

    private:
        void initializeCentroids(const std::vector<std::vector<double>>& data) {
            centroids_.clear();
            std::random_device rd;
            std::mt19937 gen(rd());
            std::uniform_int_distribution<> dis(0, data.size() - 1);

            for (int i = 0; i < k_; ++i) {
                centroids_.push_back(data[dis(gen)]);
            }
        }

        std::vector<int> assignLabels(const std::vector<std::vector<double>>& data) {
            std::vector<int> labels(data.size());

            for (size_t i = 0; i < data.size(); ++i) {
                double min_dist = std::numeric_limits<double>::max();
                int closest_centroid = 0;

                for (int j = 0; j < k_; ++j) {
                    double dist = euclideanDistance(data[i], centroids_[j]);
                    if (dist < min_dist) {
                        min_dist = dist;
                        closest_centroid = j;
                    }
                }

                labels[i] = closest_centroid;
            }

            return labels;
        }

        void updateCentroids(const std::vector<std::vector<double>>& data,
                           const std::vector<int>& labels) {
            std::vector<std::vector<double>> new_centroids(k_);
            std::vector<int> counts(k_, 0);

            // Initialize new centroids
            for (auto& centroid : new_centroids) {
                centroid.assign(data[0].size(), 0.0);
            }

            // Sum up points for each cluster
            for (size_t i = 0; i < data.size(); ++i) {
                int cluster = labels[i];
                for (size_t j = 0; j < data[i].size(); ++j) {
                    new_centroids[cluster][j] += data[i][j];
                }
                counts[cluster]++;
            }

            // Calculate means
            for (int i = 0; i < k_; ++i) {
                if (counts[i] > 0) {
                    for (size_t j = 0; j < new_centroids[i].size(); ++j) {
                        new_centroids[i][j] /= counts[i];
                    }
                }
            }

            centroids_ = new_centroids;
        }

        bool isConverged(const std::vector<std::vector<double>>& data,
                        const std::vector<int>& labels) {
            static std::vector<int> prev_labels;
            bool converged = (prev_labels == labels);
            prev_labels = labels;
            return converged;
        }

        double euclideanDistance(const std::vector<double>& a, const std::vector<double>& b) {
            double sum = 0.0;
            for (size_t i = 0; i < a.size(); ++i) {
                sum += (a[i] - b[i]) * (a[i] - b[i]);
            }
            return sqrt(sum);
        }

        int k_;
        int max_iters_;
        std::vector<std::vector<double>> centroids_;
    };

    // Principal Component Analysis for dimensionality reduction
    class PCA {
    public:
        void fit(const std::vector<std::vector<double>>& data) {
            // Center the data
            auto centered_data = centerData(data);

            // Compute covariance matrix
            auto cov_matrix = computeCovarianceMatrix(centered_data);

            // Compute eigenvalues and eigenvectors (simplified)
            // In practice, use a library like Eigen or implement proper eigendecomposition
            computeEigendecomposition(cov_matrix);

            // Sort by eigenvalues (descending)
            sortComponents();
        }

        std::vector<std::vector<double>> transform(const std::vector<std::vector<double>>& data, int n_components) {
            // Center the data
            auto centered_data = centerData(data);

            // Project onto principal components
            std::vector<std::vector<double>> result;
            for (const auto& sample : centered_data) {
                std::vector<double> transformed(n_components);
                for (int i = 0; i < n_components; ++i) {
                    double projection = 0.0;
                    for (size_t j = 0; j < sample.size(); ++j) {
                        projection += sample[j] * components_[i][j];
                    }
                    transformed[i] = projection;
                }
                result.push_back(transformed);
            }

            return result;
        }

    private:
        std::vector<std::vector<double>> centerData(const std::vector<std::vector<double>>& data) {
            if (data.empty()) return {};

            // Calculate means
            std::vector<double> means(data[0].size(), 0.0);
            for (const auto& sample : data) {
                for (size_t i = 0; i < sample.size(); ++i) {
                    means[i] += sample[i];
                }
            }
            for (auto& mean : means) {
                mean /= data.size();
            }

            // Center the data
            std::vector<std::vector<double>> centered;
            for (const auto& sample : data) {
                std::vector<double> centered_sample(sample.size());
                for (size_t i = 0; i < sample.size(); ++i) {
                    centered_sample[i] = sample[i] - means[i];
                }
                centered.push_back(centered_sample);
            }

            return centered;
        }

        std::vector<std::vector<double>> computeCovarianceMatrix(const std::vector<std::vector<double>>& data) {
            int n_features = data[0].size();
            std::vector<std::vector<double>> cov_matrix(n_features, std::vector<double>(n_features, 0.0));

            for (int i = 0; i < n_features; ++i) {
                for (int j = 0; j < n_features; ++j) {
                    double sum = 0.0;
                    for (const auto& sample : data) {
                        sum += sample[i] * sample[j];
                    }
                    cov_matrix[i][j] = sum / (data.size() - 1);
                }
            }

            return cov_matrix;
        }

        void computeEigendecomposition(const std::vector<std::vector<double>>& matrix) {
            // Simplified eigendecomposition (in practice, use proper algorithm)
            // This is a placeholder implementation
            int n = matrix.size();
            components_.assign(n, std::vector<double>(n, 0.0));
            eigenvalues_.assign(n, 1.0);

            // Set identity matrix as components (placeholder)
            for (int i = 0; i < n; ++i) {
                components_[i][i] = 1.0;
            }
        }

        void sortComponents() {
            // Sort components by eigenvalues (descending)
            // Implementation would reorder components_ and eigenvalues_
        }

        std::vector<std::vector<double>> components_;
        std::vector<double> eigenvalues_;
    };

private:
    KMeans kmeans_{3};  // Example: 3 clusters
    PCA pca_;
};
```

### 3. Reinforcement Learning
Learning through interaction with the environment to maximize rewards:

```cpp
#include <vector>
#include <random>
#include <algorithm>

class ReinforcementLearner {
public:
    // Q-Learning implementation for discrete action spaces
    class QLearning {
    public:
        QLearning(int num_states, int num_actions, double alpha = 0.1, double gamma = 0.9, double epsilon = 0.1)
            : q_table_(num_states, std::vector<double>(num_actions, 0.0)),
              alpha_(alpha), gamma_(gamma), epsilon_(epsilon),
              num_states_(num_states), num_actions_(num_actions) {}

        int selectAction(int state) {
            if (static_cast<double>(rand()) / RAND_MAX < epsilon_) {
                // Exploration: random action
                return rand() % num_actions_;
            } else {
                // Exploitation: best known action
                return std::max_element(q_table_[state].begin(), q_table_[state].end())
                       - q_table_[state].begin();
            }
        }

        void update(int state, int action, double reward, int next_state) {
            double max_next_q = *std::max_element(q_table_[next_state].begin(), q_table_[next_state].end());
            q_table_[state][action] += alpha_ * (reward + gamma_ * max_next_q - q_table_[state][action]);
        }

        double getQValue(int state, int action) const {
            return q_table_[state][action];
        }

    private:
        std::vector<std::vector<double>> q_table_;
        double alpha_;  // Learning rate
        double gamma_;  // Discount factor
        double epsilon_; // Exploration rate
        int num_states_;
        int num_actions_;
    };

    // Deep Q-Network for continuous state spaces
    class DQN {
    public:
        DQN(int state_size, int action_size, int hidden_size = 64)
            : state_size_(state_size), action_size_(action_size) {
            // Initialize neural network weights
            initializeNetwork(hidden_size);
        }

        int selectAction(const std::vector<double>& state, double epsilon = 0.1) {
            auto q_values = forward(state);

            if (static_cast<double>(rand()) / RAND_MAX < epsilon) {
                // Exploration: random action
                return rand() % action_size_;
            } else {
                // Exploitation: best action
                return std::max_element(q_values.begin(), q_values.end()) - q_values.begin();
            }
        }

        std::vector<double> forward(const std::vector<double>& state) {
            // Forward pass through the network
            auto hidden = applyLinear(state, weights_input_hidden_, bias_hidden_);
            hidden = applyActivation(hidden);  // Apply activation function (e.g., ReLU)

            auto output = applyLinear(hidden, weights_hidden_output_, bias_output_);
            return output;
        }

        void train(const std::vector<std::vector<double>>& states,
                  const std::vector<int>& actions,
                  const std::vector<double>& rewards,
                  const std::vector<std::vector<double>>& next_states) {
            // Simplified training implementation
            // In practice, this would use gradient descent and backpropagation
        }

    private:
        void initializeNetwork(int hidden_size) {
            // Initialize weights randomly
            weights_input_hidden_.resize(hidden_size, std::vector<double>(state_size_));
            weights_hidden_output_.resize(action_size_, std::vector<double>(hidden_size));
            bias_hidden_.resize(hidden_size);
            bias_output_.resize(action_size_);

            // Random initialization
            for (auto& row : weights_input_hidden_) {
                for (auto& weight : row) {
                    weight = (static_cast<double>(rand()) / RAND_MAX - 0.5) * 2; // -1 to 1
                }
            }

            for (auto& row : weights_hidden_output_) {
                for (auto& weight : row) {
                    weight = (static_cast<double>(rand()) / RAND_MAX - 0.5) * 2;
                }
            }

            for (auto& bias : bias_hidden_) {
                bias = (static_cast<double>(rand()) / RAND_MAX - 0.5) * 2;
            }

            for (auto& bias : bias_output_) {
                bias = (static_cast<double>(rand()) / RAND_MAX - 0.5) * 2;
            }
        }

        std::vector<double> applyLinear(const std::vector<double>& input,
                                       const std::vector<std::vector<double>>& weights,
                                       const std::vector<double>& bias) {
            std::vector<double> output(weights.size());

            for (size_t i = 0; i < weights.size(); ++i) {
                double sum = bias[i];
                for (size_t j = 0; j < input.size(); ++j) {
                    sum += weights[i][j] * input[j];
                }
                output[i] = sum;
            }

            return output;
        }

        std::vector<double> applyActivation(const std::vector<double>& input) {
            std::vector<double> output(input.size());
            for (size_t i = 0; i < input.size(); ++i) {
                // ReLU activation: max(0, x)
                output[i] = std::max(0.0, input[i]);
            }
            return output;
        }

        int state_size_;
        int action_size_;
        std::vector<std::vector<double>> weights_input_hidden_;
        std::vector<std::vector<double>> weights_hidden_output_;
        std::vector<double> bias_hidden_;
        std::vector<double> bias_output_;
    };

    // Actor-Critic method for continuous action spaces
    class ActorCritic {
    public:
        ActorCritic(int state_size, int action_size)
            : state_size_(state_size), action_size_(action_size) {
            initializeNetworks();
        }

        std::vector<double> selectAction(const std::vector<double>& state) {
            // Get action from actor network (mean and std deviation)
            auto action_params = actorForward(state);

            // Sample action from policy distribution
            std::vector<double> action(action_size_);
            std::random_device rd;
            std::mt19937 gen(rd());

            for (int i = 0; i < action_size_; ++i) {
                std::normal_distribution<> dis(action_params[i], 0.1); // Fixed std dev for simplicity
                action[i] = dis(gen);
            }

            return action;
        }

        void update(const std::vector<double>& state,
                   const std::vector<double>& action,
                   double reward,
                   const std::vector<double>& next_state) {
            // Compute value of current and next state
            double current_value = criticForward(state);
            double next_value = criticForward(next_state);

            // Compute advantage
            double advantage = reward + gamma_ * next_value - current_value;

            // Update critic (value function)
            updateCritic(state, advantage);

            // Update actor (policy)
            updateActor(state, action, advantage);
        }

    private:
        void initializeNetworks() {
            // Initialize both actor and critic networks
            actor_weights_.resize(action_size_, std::vector<double>(state_size_));
            critic_weights_.resize(1, std::vector<double>(state_size_));

            // Random initialization
            for (auto& row : actor_weights_) {
                for (auto& weight : row) {
                    weight = (static_cast<double>(rand()) / RAND_MAX - 0.5) * 2;
                }
            }

            for (auto& row : critic_weights_) {
                for (auto& weight : row) {
                    weight = (static_cast<double>(rand()) / RAND_MAX - 0.5) * 2;
                }
            }
        }

        std::vector<double> actorForward(const std::vector<double>& state) {
            // Simple linear actor: action = W * state
            std::vector<double> action(action_size_);
            for (int i = 0; i < action_size_; ++i) {
                double sum = 0.0;
                for (size_t j = 0; j < state.size(); ++j) {
                    sum += actor_weights_[i][j] * state[j];
                }
                action[i] = sum;  // Mean for action dimension i
            }
            return action;
        }

        double criticForward(const std::vector<double>& state) {
            // Simple linear critic: value = W * state
            double value = 0.0;
            for (size_t i = 0; i < state.size(); ++i) {
                value += critic_weights_[0][i] * state[i];
            }
            return value;
        }

        void updateCritic(const std::vector<double>& state, double advantage) {
            // Update critic weights using advantage
            for (size_t i = 0; i < state.size(); ++i) {
                critic_weights_[0][i] += critic_lr_ * advantage * state[i];
            }
        }

        void updateActor(const std::vector<double>& state,
                        const std::vector<double>& action,
                        double advantage) {
            // Update actor weights using policy gradient
            for (int i = 0; i < action_size_; ++i) {
                for (size_t j = 0; j < state.size(); ++j) {
                    // Simplified gradient update
                    actor_weights_[i][j] += actor_lr_ * advantage * state[j];
                }
            }
        }

        int state_size_;
        int action_size_;
        std::vector<std::vector<double>> actor_weights_;
        std::vector<std::vector<double>> critic_weights_;
        double gamma_ = 0.99;
        double actor_lr_ = 0.001;
        double critic_lr_ = 0.01;
    };

private:
    QLearning q_learning_{100, 4};  // Example: 100 states, 4 actions
    DQN dqn_{8, 4};  // Example: 8 state features, 4 actions
    ActorCritic actor_critic_{8, 2};  // Example: 8 state features, 2 action dimensions
};
```

## Learning in Humanoid Robotics Context

### Imitation Learning
Learning from human demonstrations:

```cpp
#include <vector>
#include <map>

class ImitationLearner {
public:
    struct Demonstration {
        std::vector<std::vector<double>> states;      // Robot states during demonstration
        std::vector<std::vector<double>> actions;     // Human actions during demonstration
        std::vector<double> rewards;                  // Reward signal (if available)
    };

    void addDemonstration(const Demonstration& demo) {
        demonstrations_.push_back(demo);

        // Update the policy based on the new demonstration
        updatePolicy(demo);
    }

    std::vector<double> predictAction(const std::vector<double>& state) {
        // Use the learned policy to predict action for given state
        return policy_.predict(state);
    }

    void trainPolicy() {
        // Aggregate all demonstrations and train the policy
        std::vector<std::vector<double>> all_states;
        std::vector<std::vector<double>> all_actions;

        for (const auto& demo : demonstrations_) {
            all_states.insert(all_states.end(), demo.states.begin(), demo.states.end());
            all_actions.insert(all_actions.end(), demo.actions.begin(), demo.actions.end());
        }

        // Train supervised model on state-action pairs
        policy_.train(all_states, all_actions);
    }

private:
    class PolicyNetwork {
    public:
        void train(const std::vector<std::vector<double>>& states,
                  const std::vector<std::vector<double>>& actions) {
            // Train neural network to map states to actions
            // Implementation would use backpropagation
        }

        std::vector<double> predict(const std::vector<double>& state) {
            // Return predicted action for given state
            return std::vector<double>(action_size_, 0.0); // Placeholder
        }

    private:
        int action_size_ = 6; // Example: 6 joint commands
    };

    void updatePolicy(const Demonstration& demo) {
        // Update policy incrementally based on new demonstration
        // This could use various techniques like DAgger (Dataset Aggregation)
    }

    std::vector<Demonstration> demonstrations_;
    PolicyNetwork policy_;
};
```

### Transfer Learning
Applying knowledge from one domain to another:

```cpp
class TransferLearner {
public:
    struct TaskDescription {
        std::string name;
        std::vector<double> features;  // Task characteristics
        std::string domain;            // Source domain
    };

    void registerSourceTask(const TaskDescription& task, const std::vector<double>& policy_params) {
        source_tasks_[task.name] = {task, policy_params};
    }

    std::vector<double> adaptPolicy(const TaskDescription& target_task) {
        // Find similar source tasks
        auto similar_tasks = findSimilarTasks(target_task);

        // Adapt policy from similar tasks
        return adaptFromTasks(similar_tasks, target_task);
    }

    double computeTaskSimilarity(const TaskDescription& task1, const TaskDescription& task2) {
        // Compute similarity between tasks based on features
        if (task1.domain != task2.domain) {
            return 0.1; // Low similarity across domains
        }

        // Compute feature similarity (cosine similarity)
        double dot_product = 0.0, norm1 = 0.0, norm2 = 0.0;
        for (size_t i = 0; i < std::min(task1.features.size(), task2.features.size()); ++i) {
            dot_product += task1.features[i] * task2.features[i];
            norm1 += task1.features[i] * task1.features[i];
            norm2 += task2.features[i] * task2.features[i];
        }

        if (norm1 == 0 || norm2 == 0) return 0.0;
        return dot_product / (sqrt(norm1) * sqrt(norm2));
    }

private:
    std::vector<TaskDescription> findSimilarTasks(const TaskDescription& target_task) {
        std::vector<std::pair<double, TaskDescription>> similarities;

        for (const auto& [name, task_data] : source_tasks_) {
            double similarity = computeTaskSimilarity(target_task, task_data.first);
            similarities.push_back({similarity, task_data.first});
        }

        // Sort by similarity (descending)
        std::sort(similarities.begin(), similarities.end(),
                  [](const auto& a, const auto& b) { return a.first > b.first; });

        // Return top similar tasks
        std::vector<TaskDescription> result;
        for (size_t i = 0; i < std::min(similarities.size(), (size_t)5); ++i) {
            result.push_back(similarities[i].second);
        }

        return result;
    }

    std::vector<double> adaptFromTasks(const std::vector<TaskDescription>& similar_tasks,
                                      const TaskDescription& target_task) {
        // Adapt policy based on similar tasks
        // This could involve fine-tuning, parameter transfer, or other adaptation methods
        return std::vector<double>(); // Placeholder
    }

    std::map<std::string, std::pair<TaskDescription, std::vector<double>>> source_tasks_;
};
```

## Deep Learning for Robotics

### Convolutional Neural Networks for Perception
Processing visual and spatial information:

```cpp
class CNNPerception {
public:
    struct ConvLayer {
        std::vector<std::vector<std::vector<double>>> weights;  // [filters][height][width]
        std::vector<double> biases;
        int filter_size;
        int num_filters;
    };

    std::vector<double> forward(const std::vector<std::vector<double>>& input) {
        auto result = input;  // Start with input

        for (auto& layer : conv_layers_) {
            result = applyConvolution(result, layer);
            result = applyReLU(result);  // Apply activation
        }

        // Flatten for fully connected layers
        auto flattened = flatten(result);

        // Apply fully connected layers
        for (auto& fc_layer : fc_layers_) {
            flattened = applyFullyConnected(flattened, fc_layer);
            flattened = applyReLU(flattened);
        }

        return flattened;
    }

    void addConvLayer(int filter_size, int num_filters) {
        ConvLayer layer;
        layer.filter_size = filter_size;
        layer.num_filters = num_filters;

        // Initialize weights randomly
        layer.weights.resize(num_filters);
        for (auto& filter : layer.weights) {
            filter.resize(filter_size, std::vector<double>(filter_size));
            for (auto& row : filter) {
                for (auto& weight : row) {
                    weight = (static_cast<double>(rand()) / RAND_MAX - 0.5) * 2; // -1 to 1
                }
            }
        }

        layer.biases.resize(num_filters, 0.0);

        conv_layers_.push_back(layer);
    }

private:
    std::vector<std::vector<double>> applyConvolution(
        const std::vector<std::vector<double>>& input,
        const ConvLayer& layer) {

        int input_height = input.size();
        int input_width = input[0].size();
        int output_height = input_height - layer.filter_size + 1;
        int output_width = input_width - layer.filter_size + 1;

        std::vector<std::vector<double>> output(layer.num_filters,
            std::vector<double>(output_height * output_width));

        for (int f = 0; f < layer.num_filters; ++f) {
            for (int i = 0; i < output_height; ++i) {
                for (int j = 0; j < output_width; ++j) {
                    double sum = layer.biases[f];
                    for (int fi = 0; fi < layer.filter_size; ++fi) {
                        for (int fj = 0; fj < layer.filter_size; ++fj) {
                            sum += input[i + fi][j + fj] * layer.weights[f][fi][fj];
                        }
                    }
                    output[f][i * output_width + j] = sum;
                }
            }
        }

        return output;
    }

    std::vector<std::vector<double>> applyReLU(const std::vector<std::vector<double>>& input) {
        auto output = input;
        for (auto& row : output) {
            for (auto& val : row) {
                val = std::max(0.0, val);
            }
        }
        return output;
    }

    std::vector<double> flatten(const std::vector<std::vector<double>>& input) {
        std::vector<double> flattened;
        for (const auto& row : input) {
            flattened.insert(flattened.end(), row.begin(), row.end());
        }
        return flattened;
    }

    std::vector<double> applyFullyConnected(
        const std::vector<double>& input,
        const std::vector<std::vector<double>>& weights) {

        std::vector<double> output(weights.size());
        for (size_t i = 0; i < weights.size(); ++i) {
            double sum = 0.0;
            for (size_t j = 0; j < input.size(); ++j) {
                sum += input[j] * weights[i][j];
            }
            output[i] = sum;
        }
        return output;
    }

    std::vector<ConvLayer> conv_layers_;
    std::vector<std::vector<std::vector<double>>> fc_layers_;
};
```

### Recurrent Neural Networks for Sequential Tasks
Handling temporal dependencies:

```cpp
class RNNController {
public:
    class LSTMCell {
    public:
        LSTMCell(int input_size, int hidden_size)
            : input_size_(input_size), hidden_size_(hidden_size) {
            initializeWeights();
        }

        std::vector<double> forward(const std::vector<double>& input,
                                   const std::vector<double>& prev_cell_state,
                                   const std::vector<double>& prev_hidden_state) {

            // Concatenate input and previous hidden state
            std::vector<double> combined_input;
            combined_input.insert(combined_input.end(), input.begin(), input.end());
            combined_input.insert(combined_input.end(), prev_hidden_state.begin(), prev_hidden_state.end());

            // Compute gates
            auto input_gate = computeGate(combined_input, w_ii_, b_ii_);
            auto forget_gate = computeGate(combined_input, w_if_, b_if_);
            auto output_gate = computeGate(combined_input, w_io_, b_io_);

            // Compute candidate cell state
            auto candidate_state = computeGate(combined_input, w_ic_, b_ic_);
            candidate_state = applyTanh(candidate_state);

            // Update cell state
            std::vector<double> new_cell_state(hidden_size_);
            for (int i = 0; i < hidden_size_; ++i) {
                new_cell_state[i] = forget_gate[i] * prev_cell_state[i] +
                                  input_gate[i] * candidate_state[i];
            }

            // Compute new hidden state
            auto new_hidden_state = applyTanh(new_cell_state);
            for (int i = 0; i < hidden_size_; ++i) {
                new_hidden_state[i] *= output_gate[i];
            }

            hidden_state_ = new_hidden_state;
            cell_state_ = new_cell_state;

            return new_hidden_state;
        }

        std::vector<double> getHiddenState() const { return hidden_state_; }
        std::vector<double> getCellState() const { return cell_state_; }

    private:
        void initializeWeights() {
            // Initialize all weight matrices and biases randomly
            w_ii_.resize(hidden_size_, std::vector<double>(input_size_ + hidden_size_));
            w_if_.resize(hidden_size_, std::vector<double>(input_size_ + hidden_size_));
            w_io_.resize(hidden_size_, std::vector<double>(input_size_ + hidden_size_));
            w_ic_.resize(hidden_size_, std::vector<double>(input_size_ + hidden_size_));

            b_ii_.resize(hidden_size_);
            b_if_.resize(hidden_size_);
            b_io_.resize(hidden_size_);
            b_ic_.resize(hidden_size_);

            // Random initialization
            initializeRandom(w_ii_);
            initializeRandom(w_if_);
            initializeRandom(w_io_);
            initializeRandom(w_ic_);

            initializeRandom(b_ii_);
            initializeRandom(b_if_);
            initializeRandom(b_io_);
            initializeRandom(b_ic_);

            // Initialize states to zero
            hidden_state_.assign(hidden_size_, 0.0);
            cell_state_.assign(hidden_size_, 0.0);
        }

        void initializeRandom(std::vector<std::vector<double>>& weights) {
            for (auto& row : weights) {
                for (auto& weight : row) {
                    weight = (static_cast<double>(rand()) / RAND_MAX - 0.5) * 0.1; // Small random values
                }
            }
        }

        void initializeRandom(std::vector<double>& biases) {
            for (auto& bias : biases) {
                bias = (static_cast<double>(rand()) / RAND_MAX - 0.5) * 0.1;
            }
        }

        std::vector<double> computeGate(const std::vector<double>& input,
                                       const std::vector<std::vector<double>>& weights,
                                       const std::vector<double>& biases) {
            std::vector<double> output(hidden_size_);
            for (int i = 0; i < hidden_size_; ++i) {
                double sum = biases[i];
                for (size_t j = 0; j < input.size(); ++j) {
                    sum += input[j] * weights[i][j];
                }
                output[i] = sigmoid(sum);
            }
            return output;
        }

        std::vector<double> applyTanh(const std::vector<double>& input) {
            std::vector<double> output(input.size());
            for (size_t i = 0; i < input.size(); ++i) {
                output[i] = tanh(input[i]);
            }
            return output;
        }

        double sigmoid(double x) {
            return 1.0 / (1.0 + exp(-x));
        }

        int input_size_;
        int hidden_size_;

        // Weight matrices for different gates
        std::vector<std::vector<double>> w_ii_, w_if_, w_io_, w_ic_;
        // Bias vectors
        std::vector<double> b_ii_, b_if_, b_io_, b_ic_;

        std::vector<double> hidden_state_;
        std::vector<double> cell_state_;
    };

    std::vector<double> processSequence(const std::vector<std::vector<double>>& sequence) {
        // Process each time step in the sequence
        for (const auto& input : sequence) {
            lstm_cell_.forward(input, lstm_cell_.getCellState(), lstm_cell_.getHiddenState());
        }

        // Return the final hidden state as output
        return lstm_cell_.getHiddenState();
    }

private:
    LSTMCell lstm_cell_{4, 16};  // Example: 4 input dimensions, 16 hidden units
};
```

## Learning System Integration

### Multi-Task Learning Framework
Enabling robots to learn multiple related tasks simultaneously:

```cpp
class MultiTaskLearner {
public:
    struct Task {
        std::string name;
        std::function<std::vector<double>(const std::vector<double>&)> policy;
        std::vector<std::vector<double>> training_data;
        double performance;  // Current performance on this task
    };

    void addTask(const Task& task) {
        tasks_.push_back(task);

        // Initialize shared representations
        initializeSharedRepresentations();
    }

    std::vector<double> executeTask(const std::string& task_name,
                                   const std::vector<double>& state) {
        auto task_it = std::find_if(tasks_.begin(), tasks_.end(),
            [&task_name](const Task& task) { return task.name == task_name; });

        if (task_it != tasks_.end()) {
            // Process through shared representations first
            auto shared_repr = computeSharedRepresentation(state);

            // Combine with task-specific processing
            return task_it->policy(shared_repr);
        }

        return std::vector<double>(); // Return empty if task not found
    }

    void train() {
        // Train on all tasks simultaneously using shared representations
        for (auto& task : tasks_) {
            // Update task-specific components
            updateTaskSpecific(task);

            // Update shared components based on all tasks
            updateSharedComponents();
        }
    }

private:
    void initializeSharedRepresentations() {
        // Initialize shared neural network layers
        // These will be used across all tasks
        shared_layers_.resize(3);  // Example: 3 shared layers
        for (auto& layer : shared_layers_) {
            layer.resize(64, std::vector<double>(64));  // Example: 64x64 weight matrices
            // Initialize randomly
        }
    }

    std::vector<double> computeSharedRepresentation(const std::vector<double>& input) {
        // Process input through shared layers
        auto current = input;

        for (const auto& layer : shared_layers_) {
            // Apply linear transformation
            std::vector<double> next(layer.size(), 0.0);
            for (size_t i = 0; i < layer.size(); ++i) {
                for (size_t j = 0; j < current.size() && j < layer[i].size(); ++j) {
                    next[i] += current[j] * layer[i][j];
                }
                // Apply activation function
                next[i] = std::max(0.0, next[i]);  // ReLU
            }
            current = next;
        }

        return current;
    }

    void updateTaskSpecific(Task& task) {
        // Update task-specific components using task's training data
        // Implementation would depend on the specific learning algorithm
    }

    void updateSharedComponents() {
        // Update shared representations to benefit all tasks
        // This might involve gradient updates based on all tasks' performance
    }

    std::vector<Task> tasks_;
    std::vector<std::vector<std::vector<double>>> shared_layers_;
};
```

## Learning in Real-World Robotics

### Safety-Considered Learning
Ensuring learning algorithms don't compromise robot safety:

```cpp
class SafeLearner {
public:
    struct SafetyConstraint {
        std::string type;  // "velocity", "torque", "position", etc.
        double min_value;
        double max_value;
        std::function<bool(const std::vector<double>&)> check_function;
    };

    void addSafetyConstraint(const SafetyConstraint& constraint) {
        safety_constraints_.push_back(constraint);
    }

    std::vector<double> safeActionSelection(const std::vector<double>& state,
                                           std::function<std::vector<double>(const std::vector<double>&)> base_policy) {
        auto proposed_action = base_policy(state);

        // Check if action violates any safety constraints
        if (isActionSafe(proposed_action)) {
            return proposed_action;
        }

        // If unsafe, modify action to be safe
        return projectToSafeSpace(proposed_action);
    }

    bool isActionSafe(const std::vector<double>& action) {
        for (const auto& constraint : safety_constraints_) {
            if (!constraint.check_function(action)) {
                return false;
            }
        }
        return true;
    }

    std::vector<double> projectToSafeSpace(const std::vector<double>& action) {
        auto safe_action = action;

        for (size_t i = 0; i < safety_constraints_.size() && i < action.size(); ++i) {
            const auto& constraint = safety_constraints_[i];
            safe_action[i] = std::max(constraint.min_value,
                                    std::min(constraint.max_value, action[i]));
        }

        return safe_action;
    }

private:
    std::vector<SafetyConstraint> safety_constraints_;
};
```

## Next Steps

Continue with the [Decision Making](./decision-making.md) section to explore how learned knowledge is used for making intelligent decisions in humanoid robots.