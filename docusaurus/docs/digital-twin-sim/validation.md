---
title: Digital Twin Validation
description: Techniques and methodologies for validating digital twin systems in humanoid robotics
sidebar_position: 3
tags: [digital-twin, validation, verification, testing, humanoid]
---

# Digital Twin Validation

## Overview

Validation of digital twin systems is critical to ensure that virtual representations accurately reflect physical robot behavior. This section covers methodologies, metrics, and tools for validating digital twin systems in humanoid robotics applications.

## Validation Objectives

### 1. Model Fidelity Validation
Ensuring the digital twin accurately represents the physical system:

- **Geometric Accuracy**: Physical dimensions match virtual model
- **Kinematic Accuracy**: Joint ranges, velocities, and positions match
- **Dynamic Accuracy**: Mass properties, inertias, and forces align
- **Sensor Accuracy**: Virtual sensors produce data similar to physical sensors

### 2. Behavioral Validation
Verifying that the digital twin exhibits the same behaviors as the physical system:

- **Motion Patterns**: Walking, manipulation, and other behaviors match
- **Response Characteristics**: System responses to inputs are consistent
- **Failure Modes**: System behaves similarly when components fail
- **Environmental Interactions**: Responses to environmental conditions match

### 3. Temporal Validation
Ensuring synchronization between physical and virtual systems:

- **Time Alignment**: Events occur simultaneously in both systems
- **Latency Management**: Communication delays are within acceptable bounds
- **Update Frequency**: Data synchronization occurs at appropriate rates
- **Temporal Drift**: Systems remain synchronized over extended periods

## Validation Methodologies

### 1. Comparative Testing

#### Direct Comparison Approach
The most straightforward validation method compares physical and virtual system outputs:

```cpp
#include <rclcpp/rclcpp.hpp>
#include <sensor_msgs/msg/joint_state.hpp>
#include <geometry_msgs/msg/pose.hpp>
#include <std_msgs/msg/float64_multi_array.hpp>

class ValidationComparator : public rclcpp::Node
{
public:
    ValidationComparator()
    : Node("validation_comparator")
    {
        // Subscriptions for both physical and virtual data
        physical_joint_sub_ = this->create_subscription<sensor_msgs::msg::JointState>(
            "physical/joint_states", 10,
            std::bind(&ValidationComparator::physicalJointCallback, this, std::placeholders::_1));

        virtual_joint_sub_ = this->create_subscription<sensor_msgs::msg::JointState>(
            "virtual/joint_states", 10,
            std::bind(&ValidationComparator::virtualJointCallback, this, std::placeholders::_1));

        // Publisher for validation metrics
        validation_pub_ = this->create_publisher<std_msgs::msg::Float64MultiArray>(
            "validation_metrics", 10);

        // Timer for validation analysis
        analysis_timer_ = this->create_wall_timer(
            std::chrono::seconds(1), // Analyze every second
            std::bind(&ValidationComparator::analysisCallback, this));
    }

private:
    void physicalJointCallback(const sensor_msgs::msg::JointState::SharedPtr msg)
    {
        std::lock_guard<std::mutex> lock(data_mutex_);
        physical_joint_data_ = *msg;
        physical_data_timestamp_ = this->now();
    }

    void virtualJointCallback(const sensor_msgs::msg::JointState::SharedPtr msg)
    {
        std::lock_guard<std::mutex> lock(data_mutex_);
        virtual_joint_data_ = *msg;
        virtual_data_timestamp_ = this->now();
    }

    void analysisCallback()
    {
        std::lock_guard<std::mutex> lock(data_mutex_);

        if (physical_joint_data_.position.empty() || virtual_joint_data_.position.empty()) {
            return; // No data to compare
        }

        // Calculate validation metrics
        auto metrics = calculateValidationMetrics();

        // Publish metrics
        auto metrics_msg = std_msgs::msg::Float64MultiArray();
        metrics_msg.data = metrics;
        validation_pub_->publish(metrics_msg);

        // Log validation results
        logValidationResults(metrics);
    }

    std::vector<double> calculateValidationMetrics()
    {
        std::vector<double> metrics;

        // Calculate position error
        double pos_error = 0.0;
        size_t min_size = std::min(physical_joint_data_.position.size(),
                                  virtual_joint_data_.position.size());

        for (size_t i = 0; i < min_size; ++i) {
            double diff = physical_joint_data_.position[i] - virtual_joint_data_.position[i];
            pos_error += diff * diff;
        }
        pos_error = std::sqrt(pos_error / min_size);
        metrics.push_back(pos_error); // Position RMSE

        // Calculate velocity error
        double vel_error = 0.0;
        size_t vel_min_size = std::min(physical_joint_data_.velocity.size(),
                                      virtual_joint_data_.velocity.size());

        for (size_t i = 0; i < vel_min_size; ++i) {
            double diff = physical_joint_data_.velocity[i] - virtual_joint_data_.velocity[i];
            vel_error += diff * diff;
        }
        vel_error = std::sqrt(vel_error / vel_min_size);
        metrics.push_back(vel_error); // Velocity RMSE

        // Calculate timestamp difference
        auto time_diff = (physical_data_timestamp_ - virtual_data_timestamp_).seconds();
        metrics.push_back(std::abs(time_diff)); // Time sync error

        return metrics;
    }

    void logValidationResults(const std::vector<double>& metrics)
    {
        if (metrics.size() >= 3) {
            RCLCPP_INFO(this->get_logger(),
                "Validation Metrics - Position RMSE: %.4f rad, "
                "Velocity RMSE: %.4f rad/s, Time Sync Error: %.4f s",
                metrics[0], metrics[1], metrics[2]);

            // Check if validation thresholds are exceeded
            if (metrics[0] > position_threshold_) {
                RCLCPP_WARN(this->get_logger(),
                    "Position validation threshold exceeded: %.4f > %.4f",
                    metrics[0], position_threshold_);
            }

            if (metrics[1] > velocity_threshold_) {
                RCLCPP_WARN(this->get_logger(),
                    "Velocity validation threshold exceeded: %.4f > %.4f",
                    metrics[1], velocity_threshold_);
            }
        }
    }

    rclcpp::Subscription<sensor_msgs::msg::JointState>::SharedPtr physical_joint_sub_;
    rclcpp::Subscription<sensor_msgs::msg::JointState>::SharedPtr virtual_joint_sub_;
    rclcpp::Publisher<std_msgs::msg::Float64MultiArray>::SharedPtr validation_pub_;
    rclcpp::TimerBase::SharedPtr analysis_timer_;

    sensor_msgs::msg::JointState physical_joint_data_;
    sensor_msgs::msg::JointState virtual_joint_data_;
    rclcpp::Time physical_data_timestamp_;
    rclcpp::Time virtual_data_timestamp_;
    std::mutex data_mutex_;

    // Validation thresholds
    double position_threshold_ = 0.01; // 10 mrad
    double velocity_threshold_ = 0.1;  // 0.1 rad/s
};
```

#### Cross-Correlation Analysis
Analyzing the correlation between physical and virtual system behaviors:

```python
import numpy as np
from scipy import signal
import matplotlib.pyplot as plt

class CrossCorrelationValidator:
    def __init__(self):
        self.physical_data_buffer = []
        self.virtual_data_buffer = []
        self.max_buffer_size = 1000  # Keep last 1000 samples

    def add_data_pair(self, physical_value, virtual_value, timestamp):
        """Add a pair of physical and virtual data points"""
        self.physical_data_buffer.append((timestamp, physical_value))
        self.virtual_data_buffer.append((timestamp, virtual_value))

        # Maintain buffer size
        if len(self.physical_data_buffer) > self.max_buffer_size:
            self.physical_data_buffer.pop(0)
            self.virtual_data_buffer.pop(0)

    def calculate_correlation(self):
        """Calculate cross-correlation between physical and virtual data"""
        if len(self.physical_data_buffer) < 10:  # Need minimum samples
            return 0.0

        # Extract just the values (not timestamps)
        physical_values = [x[1] for x in self.physical_data_buffer]
        virtual_values = [x[1] for x in self.virtual_data_buffer]

        # Calculate cross-correlation
        correlation = np.corrcoef(physical_values, virtual_values)
        return correlation[0, 1]  # Return correlation coefficient

    def calculate_phase_difference(self):
        """Calculate phase difference between signals"""
        if len(self.physical_data_buffer) < 10:
            return 0.0

        physical_values = np.array([x[1] for x in self.physical_data_buffer])
        virtual_values = np.array([x[1] for x in self.virtual_data_buffer])

        # Use cross-spectral analysis to find phase difference
        freqs, psd_physical = signal.welch(physical_values, fs=100)  # Assume 100Hz sampling
        freqs, psd_virtual = signal.welch(virtual_values, fs=100)

        # Calculate cross-spectrum
        f, Pxy = signal.csd(physical_values, virtual_values, fs=100)

        # Phase difference in radians
        phase_diff = np.angle(Pxy)
        avg_phase_diff = np.mean(np.abs(phase_diff))

        return avg_phase_diff

    def validate_synchronization(self):
        """Validate temporal synchronization"""
        if len(self.physical_data_buffer) < 2:
            return 1.0  # Perfect sync for insufficient data

        # Calculate timing differences
        physical_timestamps = [x[0] for x in self.physical_data_buffer]
        virtual_timestamps = [x[0] for x in self.virtual_data_buffer]

        # Calculate average time difference
        time_diffs = [abs(p - v) for p, v in zip(physical_timestamps, virtual_timestamps)]
        avg_time_diff = np.mean(time_diffs)

        # Return synchronization quality (1.0 = perfect, 0.0 = poor)
        max_acceptable_diff = 0.01  # 10ms
        sync_quality = max(0.0, 1.0 - (avg_time_diff / max_acceptable_diff))

        return sync_quality
```

### 2. Statistical Validation

#### Monte Carlo Validation
Using statistical methods to validate system behavior across multiple scenarios:

```cpp
#include <rclcpp/rclcpp.hpp>
#include <std_msgs/msg/float64_multi_array.hpp>
#include <random>

class MonteCarloValidator : public rclcpp::Node
{
public:
    MonteCarloValidator()
    : Node("monte_carlo_validator")
    {
        validation_pub_ = this->create_publisher<std_msgs::msg::Float64MultiArray>(
            "monte_carlo_validation", 10);

        // Timer for running validation tests
        test_timer_ = this->create_wall_timer(
            std::chrono::seconds(5), // Run test every 5 seconds
            std::bind(&MonteCarloValidator::runMonteCarloTest, this));
    }

private:
    void runMonteCarloTest()
    {
        // Define test scenarios
        std::vector<std::vector<double>> test_scenarios = generateTestScenarios();

        std::vector<double> results;

        for (const auto& scenario : test_scenarios) {
            // Run physical test
            auto physical_result = runPhysicalTest(scenario);

            // Run virtual test (simulated)
            auto virtual_result = runVirtualTest(scenario);

            // Compare results
            double similarity = calculateSimilarity(physical_result, virtual_result);
            results.push_back(similarity);
        }

        // Calculate statistics
        double mean_similarity = calculateMean(results);
        double std_dev = calculateStdDev(results, mean_similarity);

        // Publish validation statistics
        auto stats_msg = std_msgs::msg::Float64MultiArray();
        stats_msg.data = {mean_similarity, std_dev, static_cast<double>(results.size())};
        validation_pub_->publish(stats_msg);

        RCLCPP_INFO(this->get_logger(),
            "Monte Carlo Validation: Mean similarity = %.3f, Std dev = %.3f",
            mean_similarity, std_dev);
    }

    std::vector<std::vector<double>> generateTestScenarios()
    {
        // Generate various test scenarios with different parameters
        std::vector<std::vector<double>> scenarios;

        // Example: Different walking patterns
        for (int i = 0; i < 20; ++i) {  // 20 test scenarios
            std::vector<double> scenario;

            // Add random parameters for this scenario
            scenario.push_back(generateRandom(0.5, 1.5));    // Step size
            scenario.push_back(generateRandom(0.1, 0.5));    // Step height
            scenario.push_back(generateRandom(0.5, 2.0));    // Walking speed
            scenario.push_back(generateRandom(0.0, 0.2));    // Noise level

            scenarios.push_back(scenario);
        }

        return scenarios;
    }

    std::vector<double> runPhysicalTest(const std::vector<double>& parameters)
    {
        // In a real system, this would execute the test on the physical robot
        // For simulation, we'll generate realistic results with some noise
        std::vector<double> result;

        // Simulate physical robot response
        result.push_back(parameters[0] * 0.95 + generateRandom(-0.02, 0.02)); // Position with noise
        result.push_back(parameters[1] * 0.98 + generateRandom(-0.01, 0.01)); // Height with noise
        result.push_back(parameters[2] * 1.02 + generateRandom(-0.05, 0.05)); // Speed with noise

        return result;
    }

    std::vector<double> runVirtualTest(const std::vector<double>& parameters)
    {
        // Execute test in virtual environment
        std::vector<double> result;

        // Simulate virtual robot response (should be very close to physical)
        result.push_back(parameters[0] * 0.96 + generateRandom(-0.01, 0.01)); // Position
        result.push_back(parameters[1] * 0.99 + generateRandom(-0.005, 0.005)); // Height
        result.push_back(parameters[2] * 1.01 + generateRandom(-0.02, 0.02)); // Speed

        return result;
    }

    double calculateSimilarity(const std::vector<double>& phys, const std::vector<double>& virt)
    {
        if (phys.size() != virt.size() || phys.empty()) {
            return 0.0;
        }

        double total_diff = 0.0;
        for (size_t i = 0; i < phys.size(); ++i) {
            double diff = std::abs(phys[i] - virt[i]);
            total_diff += diff * diff; // Square the difference
        }

        // Convert to similarity (1.0 = identical, 0.0 = completely different)
        double rmse = std::sqrt(total_diff / phys.size());
        double max_expected_diff = 0.1; // Define maximum acceptable difference
        double similarity = std::max(0.0, 1.0 - (rmse / max_expected_diff));

        return similarity;
    }

    double generateRandom(double min, double max)
    {
        static std::random_device rd;
        static std::mt19937 gen(rd());
        static std::uniform_real_distribution<> dis(0.0, 1.0);

        return min + (max - min) * dis(gen);
    }

    double calculateMean(const std::vector<double>& values)
    {
        if (values.empty()) return 0.0;

        double sum = 0.0;
        for (double val : values) {
            sum += val;
        }
        return sum / values.size();
    }

    double calculateStdDev(const std::vector<double>& values, double mean)
    {
        if (values.size() < 2) return 0.0;

        double sum_sq_diff = 0.0;
        for (double val : values) {
            double diff = val - mean;
            sum_sq_diff += diff * diff;
        }

        return std::sqrt(sum_sq_diff / (values.size() - 1));
    }

    rclcpp::Publisher<std_msgs::msg::Float64MultiArray>::SharedPtr validation_pub_;
    rclcpp::TimerBase::SharedPtr test_timer_;
};
```

### 3. Formal Verification Methods

#### Model Checking Approach
Using formal methods to verify digital twin properties:

```cpp
#include <rclcpp/rclcpp.hpp>
#include <std_msgs/msg/string.hpp>
#include <std_msgs/msg/bool.hpp>

class FormalValidator : public rclcpp::Node
{
public:
    FormalValidator()
    : Node("formal_validator")
    {
        // Subscriptions for system events
        system_state_sub_ = this->create_subscription<std_msgs::msg::String>(
            "system_state", 10,
            std::bind(&FormalValidator::stateCallback, this, std::placeholders::_1));

        safety_violation_pub_ = this->create_publisher<std_msgs::msg::Bool>(
            "safety_violation", 10);

        // Timer for formal property checking
        property_timer_ = this->create_wall_timer(
            std::chrono::milliseconds(100), // Check properties at 10Hz
            std::bind(&FormalValidator::checkProperties, this));
    }

private:
    void stateCallback(const std_msgs::msg::String::SharedPtr msg)
    {
        std::lock_guard<std::mutex> lock(state_mutex_);
        current_state_ = msg->data;
    }

    void checkProperties()
    {
        std::lock_guard<std::mutex> lock(state_mutex_);

        // Check safety properties
        bool safety_violation = false;

        // Property 1: Joint limits must not be exceeded
        if (hasJointLimitViolation()) {
            RCLCPP_ERROR(this->get_logger(), "SAFETY VIOLATION: Joint limit exceeded");
            safety_violation = true;
        }

        // Property 2: Balance must be maintained within bounds
        if (hasBalanceViolation()) {
            RCLCPP_ERROR(this->get_logger(), "SAFETY VIOLATION: Balance limit exceeded");
            safety_violation = true;
        }

        // Property 3: Communication must remain within latency bounds
        if (hasLatencyViolation()) {
            RCLCPP_WARN(this->get_logger(), "PERFORMANCE VIOLATION: Communication latency exceeded");
        }

        // Publish safety violation status
        auto violation_msg = std_msgs::msg::Bool();
        violation_msg.data = safety_violation;
        safety_violation_pub_->publish(violation_msg);
    }

    bool hasJointLimitViolation()
    {
        // This would interface with actual joint state checking
        // For demonstration, we'll return false
        return false;
    }

    bool hasBalanceViolation()
    {
        // Check if robot is within balance limits
        // This would check actual balance metrics
        return false;
    }

    bool hasLatencyViolation()
    {
        // Check if communication latency is within acceptable bounds
        // This would check actual timing metrics
        return false;
    }

    rclcpp::Subscription<std_msgs::msg::String>::SharedPtr system_state_sub_;
    rclcpp::Publisher<std_msgs::msg::Bool>::SharedPtr safety_violation_pub_;
    rclcpp::TimerBase::SharedPtr property_timer_;

    std::string current_state_;
    std::mutex state_mutex_;
};
```

## Validation Metrics

### 1. Accuracy Metrics

#### Root Mean Square Error (RMSE)
Standard metric for comparing physical and virtual system outputs:

```cpp
double calculateRMSE(const std::vector<double>& physical, const std::vector<double>& virtual_vals)
{
    if (physical.size() != virtual_vals.size() || physical.empty()) {
        return std::numeric_limits<double>::max();
    }

    double sum_squared_errors = 0.0;
    for (size_t i = 0; i < physical.size(); ++i) {
        double error = physical[i] - virtual_vals[i];
        sum_squared_errors += error * error;
    }

    return std::sqrt(sum_squared_errors / physical.size());
}
```

#### Mean Absolute Error (MAE)
Less sensitive to outliers than RMSE:

```cpp
double calculateMAE(const std::vector<double>& physical, const std::vector<double>& virtual_vals)
{
    if (physical.size() != virtual_vals.size() || physical.empty()) {
        return std::numeric_limits<double>::max();
    }

    double sum_absolute_errors = 0.0;
    for (size_t i = 0; i < physical.size(); ++i) {
        sum_absolute_errors += std::abs(physical[i] - virtual_vals[i]);
    }

    return sum_absolute_errors / physical.size();
}
```

#### Correlation Coefficient
Measures linear relationship between physical and virtual data:

```cpp
double calculateCorrelation(const std::vector<double>& x, const std::vector<double>& y)
{
    if (x.size() != y.size() || x.size() < 2) {
        return 0.0;
    }

    // Calculate means
    double mean_x = std::accumulate(x.begin(), x.end(), 0.0) / x.size();
    double mean_y = std::accumulate(y.begin(), y.end(), 0.0) / y.size();

    // Calculate correlation
    double numerator = 0.0, sum_sq_x = 0.0, sum_sq_y = 0.0;

    for (size_t i = 0; i < x.size(); ++i) {
        double x_diff = x[i] - mean_x;
        double y_diff = y[i] - mean_y;

        numerator += x_diff * y_diff;
        sum_sq_x += x_diff * x_diff;
        sum_sq_y += y_diff * y_diff;
    }

    if (sum_sq_x == 0.0 || sum_sq_y == 0.0) {
        return 0.0;
    }

    return numerator / std::sqrt(sum_sq_x * sum_sq_y);
}
```

### 2. Performance Metrics

#### Synchronization Quality
Measures how well physical and virtual systems stay aligned:

```cpp
struct SyncQualityMetrics {
    double temporal_sync_error;    // Average time difference
    double data_completeness;      // Percentage of data synchronized
    double throughput;             // Data transfer rate
    double latency;                // Communication delay
};

SyncQualityMetrics calculateSyncQuality(
    const std::vector<rclcpp::Time>& physical_timestamps,
    const std::vector<rclcpp::Time>& virtual_timestamps)
{
    SyncQualityMetrics metrics = {};

    if (physical_timestamps.size() != virtual_timestamps.size() || physical_timestamps.empty()) {
        return metrics;
    }

    // Calculate temporal synchronization error
    double total_time_diff = 0.0;
    for (size_t i = 0; i < physical_timestamps.size(); ++i) {
        auto diff = (physical_timestamps[i] - virtual_timestamps[i]).seconds();
        total_time_diff += std::abs(diff);
    }
    metrics.temporal_sync_error = total_time_diff / physical_timestamps.size();

    // Calculate data completeness (assuming all data should be synchronized)
    metrics.data_completeness = 1.0; // For this simple case

    // Calculate throughput and latency would require additional information
    // about data sizes and communication patterns

    return metrics;
}
```

## Validation Tools and Frameworks

### 1. Automated Validation Suite

```python
import unittest
import numpy as np
from scipy import stats
import matplotlib.pyplot as plt

class DigitalTwinValidator:
    def __init__(self, tolerance=0.01):
        self.tolerance = tolerance
        self.validation_results = []

    def validate_position_tracking(self, physical_pos, virtual_pos, joint_name=""):
        """Validate that virtual position tracking matches physical"""
        rmse = np.sqrt(np.mean((physical_pos - virtual_pos) ** 2))

        result = {
            'test': f'Position Tracking - {joint_name}',
            'metric': 'RMSE',
            'value': rmse,
            'threshold': self.tolerance,
            'passed': rmse <= self.tolerance
        }

        self.validation_results.append(result)
        return result

    def validate_sensor_data(self, physical_data, virtual_data, sensor_type=""):
        """Validate that virtual sensor data matches physical"""
        correlation = np.corrcoef(physical_data, virtual_data)[0, 1]

        result = {
            'test': f'Sensor Data - {sensor_type}',
            'metric': 'Correlation',
            'value': correlation,
            'threshold': 0.95,  # 95% correlation minimum
            'passed': correlation >= 0.95
        }

        self.validation_results.append(result)
        return result

    def validate_response_time(self, physical_response, virtual_response):
        """Validate that response times are synchronized"""
        phys_delay = np.mean(physical_response)
        virt_delay = np.mean(virtual_response)

        time_diff = abs(phys_delay - virt_delay)

        result = {
            'test': 'Response Time Synchronization',
            'metric': 'Time Difference',
            'value': time_diff,
            'threshold': 0.01,  # 10ms max difference
            'passed': time_diff <= 0.01
        }

        self.validation_results.append(result)
        return result

    def generate_validation_report(self):
        """Generate a comprehensive validation report"""
        total_tests = len(self.validation_results)
        passed_tests = sum(1 for r in self.validation_results if r['passed'])
        pass_rate = passed_tests / total_tests if total_tests > 0 else 0

        report = {
            'total_tests': total_tests,
            'passed_tests': passed_tests,
            'pass_rate': pass_rate,
            'results': self.validation_results
        }

        return report

    def plot_validation_results(self):
        """Plot validation results for visual analysis"""
        if not self.validation_results:
            return

        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))

        # Plot metric values vs thresholds
        tests = [r['test'] for r in self.validation_results]
        values = [r['value'] for r in self.validation_results]
        thresholds = [r['threshold'] for r in self.validation_results]

        x_pos = range(len(tests))
        ax1.bar([x - 0.2 for x in x_pos], values, 0.4, label='Actual', alpha=0.8)
        ax1.bar([x + 0.2 for x in x_pos], thresholds, 0.4, label='Threshold', alpha=0.8)
        ax1.set_xticks(x_pos)
        ax1.set_xticklabels(tests, rotation=45, ha='right')
        ax1.set_ylabel('Metric Value')
        ax1.set_title('Validation Metrics vs Thresholds')
        ax1.legend()
        ax1.grid(True, alpha=0.3)

        # Plot pass/fail status
        pass_fail = [1 if r['passed'] else 0 for r in self.validation_results]
        ax2.bar(x_pos, pass_fail, color=['green' if pf else 'red' for pf in pass_fail], alpha=0.7)
        ax2.set_xticks(x_pos)
        ax2.set_xticklabels(tests, rotation=45, ha='right')
        ax2.set_ylabel('Pass/Fail (1/0)')
        ax2.set_title('Validation Pass/Fail Status')
        ax2.set_ylim(0, 1.1)
        ax2.grid(True, alpha=0.3)

        plt.tight_layout()
        plt.show()
```

### 2. Continuous Integration Validation

Example of integrating validation into CI/CD pipeline:

```yaml
# .github/workflows/validation.yml
name: Digital Twin Validation

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  validation:
    runs-on: ubuntu-latest
    container:
      image: osrf/ros:humble-desktop
    steps:
    - uses: actions/checkout@v3

    - name: Setup ROS environment
      run: |
        source /opt/ros/humble/setup.bash
        mkdir -p ws/src
        cp -r . ws/src/package
        cd ws
        colcon build
        source install/setup.bash

    - name: Run unit tests
      run: |
        source ws/install/setup.bash
        colcon test
        colcon test-result --all

    - name: Run validation tests
      run: |
        source ws/install/setup.bash
        # Run specific validation tests
        ros2 run digital_twin validation_comparator --ros-args --log-level info

    - name: Generate validation report
      run: |
        source ws/install/setup.bash
        # Generate detailed validation report
        ros2 run digital_twin validation_reporter --output validation_report.html

    - name: Upload validation artifacts
      uses: actions/upload-artifact@v3
      with:
        name: validation-results
        path: validation_report.html
```

## Validation Reporting

### Automated Report Generation

```python
class ValidationReporter:
    def __init__(self):
        self.report_data = {}

    def generate_detailed_report(self, validation_results):
        """Generate a detailed validation report"""
        import datetime

        report = {
            'timestamp': datetime.datetime.now().isoformat(),
            'summary': self._generate_summary(validation_results),
            'detailed_results': validation_results,
            'recommendations': self._generate_recommendations(validation_results)
        }

        return self._format_report(report)

    def _generate_summary(self, results):
        """Generate summary statistics"""
        total = len(results)
        passed = sum(1 for r in results if r['passed'])
        failed = total - passed

        return {
            'total_tests': total,
            'passed': passed,
            'failed': failed,
            'pass_rate': passed / total if total > 0 else 0,
            'validation_score': self._calculate_validation_score(results)
        }

    def _calculate_validation_score(self, results):
        """Calculate overall validation score"""
        if not results:
            return 0.0

        weighted_score = 0.0
        total_weight = 0.0

        for result in results:
            # Weight critical tests higher
            weight = 1.0
            if 'safety' in result['test'].lower():
                weight = 2.0  # Safety tests are weighted double
            elif 'performance' in result['test'].lower():
                weight = 1.5  # Performance tests are weighted higher

            score = 1.0 if result['passed'] else 0.0
            weighted_score += score * weight
            total_weight += weight

        return weighted_score / total_weight if total_weight > 0 else 0.0

    def _generate_recommendations(self, results):
        """Generate recommendations based on validation results"""
        recommendations = []

        failed_tests = [r for r in results if not r['passed']]

        for test in failed_tests:
            if 'position' in test['test'].lower():
                recommendations.append(
                    f"Adjust position tolerance or recalibrate sensor alignment for {test['test']}"
                )
            elif 'timing' in test['test'].lower():
                recommendations.append(
                    f"Investigate communication latency for {test['test']}"
                )
            elif 'safety' in test['test'].lower():
                recommendations.append(
                    f"Immediate attention required for safety validation failure: {test['test']}"
                )

        return recommendations

    def _format_report(self, report_data):
        """Format the report in a readable structure"""
        report = f"""
# Digital Twin Validation Report

**Generated:** {report_data['timestamp']}

## Executive Summary
- Total Tests: {report_data['summary']['total_tests']}
- Passed: {report_data['summary']['passed']}
- Failed: {report_data['summary']['failed']}
- Pass Rate: {report_data['summary']['pass_rate']:.2%}
- Validation Score: {report_data['summary']['validation_score']:.2f}/1.0

## Validation Status
"""

        for result in report_data['detailed_results']:
            status = "✅ PASS" if result['passed'] else "❌ FAIL"
            report += f"- {status} {result['test']}: {result['value']:.4f} (threshold: {result['threshold']:.4f})\n"

        if report_data['recommendations']:
            report += "\n## Recommendations\n"
            for rec in report_data['recommendations']:
                report += f"- {rec}\n"

        return report
```

## Next Steps

Continue with the next module on [AI Robot Brain](../ai-robot-brain/cognitive-arch.md) to understand how digital twin validation integrates with cognitive architectures and decision-making systems in humanoid robots.