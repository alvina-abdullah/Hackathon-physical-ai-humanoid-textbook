---
title: ROS2 Examples for Humanoid Control
description: Practical examples and code snippets for implementing humanoid robot control with ROS2
sidebar_position: 3
tags: [ros2, examples, code, humanoid, control]
---

# ROS2 Examples for Humanoid Control

## Overview

This section provides practical examples and code snippets demonstrating how to implement various aspects of humanoid robot control using ROS2. These examples cover basic to advanced control techniques, sensor integration, and safety mechanisms.

## Basic Control Examples

### Joint State Publisher
A basic example for publishing joint states:

```cpp
#include <rclcpp/rclcpp.hpp>
#include <sensor_msgs/msg/joint_state.hpp>

class JointStatePublisher : public rclcpp::Node
{
public:
    JointStatePublisher()
    : Node("joint_state_publisher")
    {
        publisher_ = this->create_publisher<sensor_msgs::msg::JointState>(
            "joint_states", 10);

        timer_ = this->create_wall_timer(
            std::chrono::milliseconds(50), // 20 Hz
            std::bind(&JointStatePublisher::publishJointStates, this));
    }

private:
    void publishJointStates()
    {
        auto msg = sensor_msgs::msg::JointState();
        msg.header.stamp = this->now();
        msg.name = {"left_hip", "left_knee", "left_ankle",
                   "right_hip", "right_knee", "right_ankle"};

        // Example positions (in radians)
        msg.position = {0.1, -0.2, 0.1, 0.1, -0.2, 0.1};

        publisher_->publish(msg);
    }

    rclcpp::Publisher<sensor_msgs::msg::JointState>::SharedPtr publisher_;
    rclcpp::TimerBase::SharedPtr timer_;
};

int main(int argc, char * argv[])
{
    rclcpp::init(argc, argv);
    rclcpp::spin(std::make_shared<JointStatePublisher>());
    rclcpp::shutdown();
    return 0;
}
```

### Trajectory Controller
Example of sending joint trajectories:

```cpp
#include <rclcpp/rclcpp.hpp>
#include <trajectory_msgs/msg/joint_trajectory.hpp>
#include <trajectory_msgs/msg/joint_trajectory_point.hpp>

class TrajectoryController : public rclcpp::Node
{
public:
    TrajectoryController()
    : Node("trajectory_controller")
    {
        publisher_ = this->create_publisher<trajectory_msgs::msg::JointTrajectory>(
            "/joint_trajectory_controller/joint_trajectory", 10);
    }

    void sendTrajectory()
    {
        auto msg = trajectory_msgs::msg::JointTrajectory();
        msg.joint_names = {"left_hip", "left_knee", "left_ankle"};

        trajectory_msgs::msg::JointTrajectoryPoint point;
        point.positions = {0.5, -1.0, 0.5};  // Target positions
        point.velocities = {0.1, -0.2, 0.1}; // Desired velocities
        point.time_from_start.sec = 2;        // Reach position in 2 seconds

        msg.points.push_back(point);

        publisher_->publish(msg);
    }

private:
    rclcpp::Publisher<trajectory_msgs::msg::JointTrajectory>::SharedPtr publisher_;
};
```

## Sensor Integration Examples

### IMU Data Processing
Processing IMU data for balance control:

```cpp
#include <rclcpp/rclcpp.hpp>
#include <sensor_msgs/msg/imu.hpp>
#include <geometry_msgs/msg/vector3.hpp>

class IMUProcessor : public rclcpp::Node
{
public:
    IMUProcessor()
    : Node("imu_processor")
    {
        subscription_ = this->create_subscription<sensor_msgs::msg::Imu>(
            "imu/data", 10,
            std::bind(&IMUProcessor::imuCallback, this, std::placeholders::_1));

        balance_publisher_ = this->create_publisher<geometry_msgs::msg::Vector3>(
            "balance_correction", 10);
    }

private:
    void imuCallback(const sensor_msgs::msg::Imu::SharedPtr msg)
    {
        // Extract orientation (using quaternion to Euler conversion)
        double roll, pitch, yaw;
        quaternionToEuler(msg->orientation, roll, pitch, yaw);

        // Calculate balance correction based on tilt
        geometry_msgs::msg::Vector3 correction;
        correction.x = -pitch * 0.5;  // Correct for forward/backward tilt
        correction.y = -roll * 0.5;   // Correct for side tilt
        correction.z = 0.0;

        // Publish balance correction
        balance_publisher_->publish(correction);

        RCLCPP_DEBUG(this->get_logger(),
            "Pitch: %.3f, Roll: %.3f, Balance correction: [%.3f, %.3f]",
            pitch, roll, correction.x, correction.y);
    }

    void quaternionToEuler(const geometry_msgs::msg::Quaternion& q,
                          double& roll, double& pitch, double& yaw)
    {
        // Convert quaternion to Euler angles
        roll = atan2(2.0 * (q.w * q.x + q.y * q.z),
                    1.0 - 2.0 * (q.x * q.x + q.y * q.y));
        pitch = asin(2.0 * (q.w * q.y - q.z * q.x));
        yaw = atan2(2.0 * (q.w * q.z + q.x * q.y),
                   1.0 - 2.0 * (q.y * q.y + q.z * q.z));
    }

    rclcpp::Subscription<sensor_msgs::msg::Imu>::SharedPtr subscription_;
    rclcpp::Publisher<geometry_msgs::msg::Vector3>::SharedPtr balance_publisher_;
};
```

### Camera Data Processing
Processing camera data for object detection:

```cpp
#include <rclcpp/rclcpp.hpp>
#include <sensor_msgs/msg/image.hpp>
#include <cv_bridge/cv_bridge.h>
#include <opencv2/opencv.hpp>
#include <opencv2/objdetect.hpp>

class CameraProcessor : public rclcpp::Node
{
public:
    CameraProcessor()
    : Node("camera_processor")
    {
        subscription_ = this->create_subscription<sensor_msgs::msg::Image>(
            "camera/image_raw", 10,
            std::bind(&CameraProcessor::imageCallback, this, std::placeholders::_1));

        // Load Haar cascade for face detection (example)
        face_cascade_.load("/usr/share/opencv4/haarcascades/haarcascade_frontalface_default.xml");
    }

private:
    void imageCallback(const sensor_msgs::msg::Image::SharedPtr msg)
    {
        try {
            cv_bridge::CvImagePtr cv_ptr = cv_bridge::toCvCopy(msg, sensor_msgs::image_encodings::BGR8);

            std::vector<cv::Rect> faces;
            cv::Mat gray;
            cv::cvtColor(cv_ptr->image, gray, cv::COLOR_BGR2GRAY);

            // Detect faces
            face_cascade_.detectMultiScale(gray, faces, 1.1, 3, 0, cv::Size(30, 30));

            // Draw rectangles around faces
            for (const auto& face : faces) {
                cv::rectangle(cv_ptr->image, face, cv::Scalar(0, 255, 0), 2);

                // Calculate face position relative to center
                int center_x = face.x + face.width / 2;
                int center_y = face.y + face.height / 2;

                // Send face tracking command
                sendFaceTrackCommand(center_x, center_y, msg->width, msg->height);
            }

            // Display the image with detections (for debugging)
            cv::imshow("Face Detection", cv_ptr->image);
            cv::waitKey(1);
        }
        catch (cv_bridge::Exception& e) {
            RCLCPP_ERROR(this->get_logger(),
                "cv_bridge exception: %s", e.what());
        }
    }

    void sendFaceTrackCommand(int face_x, int face_y, int img_width, int img_height)
    {
        // Calculate head movement to center face in view
        double pan_error = (face_x - img_width / 2.0) / (img_width / 2.0);
        double tilt_error = (face_y - img_height / 2.0) / (img_height / 2.0);

        RCLCPP_INFO(this->get_logger(),
            "Face tracking: pan_error=%.3f, tilt_error=%.3f",
            pan_error, tilt_error);
    }

    rclcpp::Subscription<sensor_msgs::msg::Image>::SharedPtr subscription_;
    cv::CascadeClassifier face_cascade_;
};
```

## Walking Pattern Generation

### Simple Walking Controller
A basic walking pattern generator:

```cpp
#include <rclcpp/rclcpp.hpp>
#include <trajectory_msgs/msg/joint_trajectory.hpp>
#include <builtin_interfaces/msg/duration.hpp>

class WalkingController : public rclcpp::Node
{
public:
    WalkingController()
    : Node("walking_controller"), step_phase_(0.0), step_count_(0)
    {
        publisher_ = this->create_publisher<trajectory_msgs::msg::JointTrajectory>(
            "/joint_trajectory_controller/joint_trajectory", 10);

        timer_ = this->create_wall_timer(
            std::chrono::milliseconds(10), // 100 Hz control loop
            std::bind(&WalkingController::controlLoop, this));
    }

private:
    void controlLoop()
    {
        // Update walking phase
        step_phase_ += 0.01; // Adjust speed as needed
        if (step_phase_ > 2 * M_PI) {
            step_phase_ = 0.0;
            step_count_++;
        }

        // Generate walking pattern based on phase
        auto trajectory = generateWalkingTrajectory(step_phase_);
        publisher_->publish(trajectory);
    }

    trajectory_msgs::msg::JointTrajectory generateWalkingTrajectory(double phase)
    {
        trajectory_msgs::msg::JointTrajectory msg;
        msg.joint_names = {"left_hip", "left_knee", "left_ankle",
                          "right_hip", "right_knee", "right_ankle"};

        trajectory_msgs::msg::JointTrajectoryPoint point;

        // Simple walking pattern using sinusoidal functions
        double left_hip = 0.2 * sin(phase);
        double right_hip = 0.2 * sin(phase + M_PI); // Opposite phase

        double left_knee = 0.3 * sin(phase * 2); // Different frequency for knee
        double right_knee = 0.3 * sin(phase * 2 + M_PI);

        // Ankle adjustments for balance
        double left_ankle = -0.1 * cos(phase);
        double right_ankle = -0.1 * cos(phase + M_PI);

        point.positions = {left_hip, left_knee, left_ankle,
                          right_hip, right_knee, right_ankle};

        point.time_from_start.sec = 0;
        point.time_from_start.nanosec = 10000000; // Next control cycle

        msg.points.push_back(point);
        return msg;
    }

    rclcpp::Publisher<trajectory_msgs::msg::JointTrajectory>::SharedPtr publisher_;
    rclcpp::TimerBase::SharedPtr timer_;
    double step_phase_;
    int step_count_;
};
```

## Safety and Emergency Handling

### Emergency Stop Node
A safety node that monitors for emergency conditions:

```cpp
#include <rclcpp/rclcpp.hpp>
#include <std_msgs/msg/bool.hpp>
#include <sensor_msgs/msg/joint_state.hpp>

class EmergencyStop : public rclcpp::Node
{
public:
    EmergencyStop()
    : Node("emergency_stop")
    {
        // Subscriptions for various safety inputs
        joint_state_sub_ = this->create_subscription<sensor_msgs::msg::JointState>(
            "joint_states", 10,
            std::bind(&EmergencyStop::jointStateCallback, this, std::placeholders::_1));

        emergency_button_sub_ = this->create_subscription<std_msgs::msg::Bool>(
            "emergency_button", 10,
            std::bind(&EmergencyStop::emergencyButtonCallback, this, std::placeholders::_1));

        // Publisher for emergency stop commands
        stop_publisher_ = this->create_publisher<std_msgs::msg::Bool>(
            "emergency_stop", 10);

        // Timer for safety checks
        safety_timer_ = this->create_wall_timer(
            std::chrono::milliseconds(50), // 20 Hz safety checks
            std::bind(&EmergencyStop::safetyCheck, this));
    }

private:
    void jointStateCallback(const sensor_msgs::msg::JointState::SharedPtr msg)
    {
        // Store joint states for safety checking
        last_joint_state_ = *msg;
    }

    void emergencyButtonCallback(const std_msgs::msg::Bool::SharedPtr msg)
    {
        if (msg->data) {
            triggerEmergencyStop("Emergency button pressed");
        }
    }

    void safetyCheck()
    {
        // Check for joint limit violations
        for (size_t i = 0; i < last_joint_state_.position.size(); ++i) {
            if (std::abs(last_joint_state_.position[i]) > joint_limit_) {
                triggerEmergencyStop("Joint limit violation: " +
                                   last_joint_state_.name[i]);
                return;
            }
        }

        // Check for excessive joint velocities
        for (size_t i = 0; i < last_joint_state_.velocity.size(); ++i) {
            if (std::abs(last_joint_state_.velocity[i]) > velocity_limit_) {
                triggerEmergencyStop("Velocity limit violation: " +
                                   last_joint_state_.name[i]);
                return;
            }
        }
    }

    void triggerEmergencyStop(const std::string& reason)
    {
        RCLCPP_ERROR(this->get_logger(), "EMERGENCY STOP: %s", reason.c_str());

        auto stop_msg = std_msgs::msg::Bool();
        stop_msg.data = true;
        stop_publisher_->publish(stop_msg);

        // Log the emergency event
        emergency_log_.push_back(std::make_pair(this->now(), reason));
    }

    rclcpp::Subscription<sensor_msgs::msg::JointState>::SharedPtr joint_state_sub_;
    rclcpp::Subscription<std_msgs::msg::Bool>::SharedPtr emergency_button_sub_;
    rclcpp::Publisher<std_msgs::msg::Bool>::SharedPtr stop_publisher_;
    rclcpp::TimerBase::SharedPtr safety_timer_;

    sensor_msgs::msg::JointState last_joint_state_;
    double joint_limit_ = 3.14; // 180 degrees
    double velocity_limit_ = 5.0; // rad/s
    std::vector<std::pair<builtin_interfaces::msg::Time, std::string>> emergency_log_;
};
```

## Behavior State Machine

### Walking State Machine
A state machine for different walking behaviors:

```cpp
#include <rclcpp/rclcpp.hpp>
#include <std_msgs/msg/string.hpp>

enum class WalkingState {
    STOPPED,
    STARTING,
    WALKING_FORWARD,
    WALKING_BACKWARD,
    TURNING_LEFT,
    TURNING_RIGHT,
    STOPPING
};

class WalkingStateMachine : public rclcpp::Node
{
public:
    WalkingStateMachine()
    : Node("walking_state_machine"), current_state_(WalkingState::STOPPED)
    {
        command_sub_ = this->create_subscription<std_msgs::msg::String>(
            "walking_command", 10,
            std::bind(&WalkingStateMachine::commandCallback, this, std::placeholders::_1));

        state_pub_ = this->create_publisher<std_msgs::msg::String>(
            "walking_state", 10);

        timer_ = this->create_wall_timer(
            std::chrono::milliseconds(100), // 10 Hz state updates
            std::bind(&WalkingStateMachine::stateUpdate, this));
    }

private:
    void commandCallback(const std_msgs::msg::String::SharedPtr msg)
    {
        std::string command = msg->data;

        switch (current_state_) {
            case WalkingState::STOPPED:
                if (command == "forward") {
                    current_state_ = WalkingState::STARTING;
                    RCLCPP_INFO(this->get_logger(), "Starting forward walk");
                } else if (command == "backward") {
                    current_state_ = WalkingState::STARTING;
                    RCLCPP_INFO(this->get_logger(), "Starting backward walk");
                } else if (command == "turn_left") {
                    current_state_ = WalkingState::TURNING_LEFT;
                    RCLCPP_INFO(this->get_logger(), "Turning left");
                } else if (command == "turn_right") {
                    current_state_ = WalkingState::TURNING_RIGHT;
                    RCLCPP_INFO(this->get_logger(), "Turning right");
                }
                break;

            case WalkingState::WALKING_FORWARD:
            case WalkingState::WALKING_BACKWARD:
                if (command == "stop") {
                    current_state_ = WalkingState::STOPPING;
                    RCLCPP_INFO(this->get_logger(), "Stopping walk");
                } else if (command == "turn_left") {
                    current_state_ = WalkingState::TURNING_LEFT;
                    RCLCPP_INFO(this->get_logger(), "Turning left while walking");
                } else if (command == "turn_right") {
                    current_state_ = WalkingState::TURNING_RIGHT;
                    RCLCPP_INFO(this->get_logger(), "Turning right while walking");
                }
                break;

            case WalkingState::TURNING_LEFT:
            case WalkingState::TURNING_RIGHT:
                if (command == "stop") {
                    current_state_ = WalkingState::STOPPING;
                    RCLCPP_INFO(this->get_logger(), "Stopping turn");
                } else if (command == "forward") {
                    current_state_ = WalkingState::WALKING_FORWARD;
                    RCLCPP_INFO(this->get_logger(), "Resuming forward walk");
                } else if (command == "backward") {
                    current_state_ = WalkingState::WALKING_BACKWARD;
                    RCLCPP_INFO(this->get_logger(), "Resuming backward walk");
                }
                break;

            case WalkingState::STARTING:
            case WalkingState::STOPPING:
                // Wait for state transition to complete
                break;
        }
    }

    void stateUpdate()
    {
        // Publish current state
        auto state_msg = std_msgs::msg::String();
        switch (current_state_) {
            case WalkingState::STOPPED:
                state_msg.data = "STOPPED";
                break;
            case WalkingState::STARTING:
                state_msg.data = "STARTING";
                // After a short time, transition to walking
                if (state_timer_++ > 10) { // 1 second at 10Hz
                    state_timer_ = 0;
                    current_state_ = (last_command_ == "backward") ?
                                    WalkingState::WALKING_BACKWARD :
                                    WalkingState::WALKING_FORWARD;
                }
                break;
            case WalkingState::WALKING_FORWARD:
                state_msg.data = "WALKING_FORWARD";
                break;
            case WalkingState::WALKING_BACKWARD:
                state_msg.data = "WALKING_BACKWARD";
                break;
            case WalkingState::TURNING_LEFT:
                state_msg.data = "TURNING_LEFT";
                break;
            case WalkingState::TURNING_RIGHT:
                state_msg.data = "TURNING_RIGHT";
                break;
            case WalkingState::STOPPING:
                state_msg.data = "STOPPING";
                // After stopping, transition to stopped
                if (state_timer_++ > 10) { // 1 second at 10Hz
                    state_timer_ = 0;
                    current_state_ = WalkingState::STOPPED;
                }
                break;
        }

        state_pub_->publish(state_msg);
    }

    rclcpp::Subscription<std_msgs::msg::String>::SharedPtr command_sub_;
    rclcpp::Publisher<std_msgs::msg::String>::SharedPtr state_pub_;
    rclcpp::TimerBase::SharedPtr timer_;

    WalkingState current_state_;
    std::string last_command_;
    int state_timer_ = 0;
};
```

## Launch Files

### Example Launch File
A launch file to start multiple nodes for humanoid control:

```python
from launch import LaunchDescription
from launch.actions import DeclareLaunchArgument
from launch.substitutions import LaunchConfiguration
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        # Declare launch arguments
        DeclareLaunchArgument(
            'use_sim_time',
            default_value='false',
            description='Use simulation clock if true'),

        # Joint state publisher
        Node(
            package='humanoid_control',
            executable='joint_state_publisher',
            name='joint_state_publisher',
            parameters=[{'use_sim_time': LaunchConfiguration('use_sim_time')}],
            output='screen'
        ),

        # IMU processor
        Node(
            package='humanoid_control',
            executable='imu_processor',
            name='imu_processor',
            parameters=[{'use_sim_time': LaunchConfiguration('use_sim_time')}],
            output='screen'
        ),

        # Walking controller
        Node(
            package='humanoid_control',
            executable='walking_controller',
            name='walking_controller',
            parameters=[{'use_sim_time': LaunchConfiguration('use_sim_time')}],
            output='screen'
        ),

        # Emergency stop monitor
        Node(
            package='humanoid_control',
            executable='emergency_stop',
            name='emergency_stop',
            parameters=[{'use_sim_time': LaunchConfiguration('use_sim_time')}],
            output='screen'
        ),

        # Walking state machine
        Node(
            package='humanoid_control',
            executable='walking_state_machine',
            name='walking_state_machine',
            parameters=[{'use_sim_time': LaunchConfiguration('use_sim_time')}],
            output='screen'
        ),
    ])
```

## CMake Configuration

### Example CMakeLists.txt
CMake configuration for a humanoid control package:

```cmake
cmake_minimum_required(VERSION 3.8)
project(humanoid_control)

if(CMAKE_COMPILER_IS_GNUCXX OR CMAKE_CXX_COMPILER_ID MATCHES "Clang")
  add_compile_options(-Wall -Wextra -Wpedantic)
endif()

# Find dependencies
find_package(ament_cmake REQUIRED)
find_package(rclcpp REQUIRED)
find_package(std_msgs REQUIRED)
find_package(sensor_msgs REQUIRED)
find_package(trajectory_msgs REQUIRED)
find_package(geometry_msgs REQUIRED)
find_package(cv_bridge REQUIRED)
find_package(OpenCV REQUIRED)

# Include directories
include_directories(include)

# Joint state publisher
add_executable(joint_state_publisher
  src/joint_state_publisher.cpp)
ament_target_dependencies(joint_state_publisher
  rclcpp
  sensor_msgs)

# IMU processor
add_executable(imu_processor
  src/imu_processor.cpp)
ament_target_dependencies(imu_processor
  rclcpp
  sensor_msgs
  geometry_msgs)
target_link_libraries(imu_processor
  ${OpenCV_LIBS})

# Walking controller
add_executable(walking_controller
  src/walking_controller.cpp)
ament_target_dependencies(walking_controller
  rclcpp
  trajectory_msgs)

# Emergency stop
add_executable(emergency_stop
  src/emergency_stop.cpp)
ament_target_dependencies(emergency_stop
  rclcpp
  sensor_msgs
  std_msgs)

# Walking state machine
add_executable(walking_state_machine
  src/walking_state_machine.cpp)
ament_target_dependencies(walking_state_machine
  rclcpp
  std_msgs)

# Install executables
install(TARGETS
  joint_state_publisher
  imu_processor
  walking_controller
  emergency_stop
  walking_state_machine
  DESTINATION lib/${PROJECT_NAME})

# Install launch files
install(DIRECTORY
  launch
  DESTINATION share/${PROJECT_NAME}/
)

ament_package()
```

## Next Steps

Explore the next module on [Digital Twin Simulation](../digital-twin-sim/overview.md) to understand how these control systems can be simulated and tested in virtual environments before deployment on physical robots.