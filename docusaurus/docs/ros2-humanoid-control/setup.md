---
title: ROS2 Setup for Humanoid Robots
description: Complete guide to setting up ROS2 for humanoid robot control
sidebar_position: 1
tags: [ros2, setup, installation, humanoid, control]
---

# ROS2 Setup for Humanoid Robots

## Overview

This guide provides comprehensive instructions for setting up ROS2 (Robot Operating System 2) for humanoid robot control. ROS2 provides the middleware, tools, and libraries necessary for developing distributed robotic applications with real-time performance and safety guarantees.

## Prerequisites

Before installing ROS2, ensure your system meets the following requirements:

### System Requirements
- **Operating System**: Ubuntu 22.04 LTS (Jammy Jellyfish) or newer
- **Processor**: Multi-core processor (Intel/AMD 64-bit)
- **Memory**: Minimum 8GB RAM (16GB recommended)
- **Storage**: At least 20GB free space
- **Network**: Internet connection for package installation

### Additional Requirements for Humanoid Robots
- **Real-time kernel**: For deterministic control
- **High-performance GPU**: For computer vision processing
- **Dedicated network**: For reliable robot communication

## ROS2 Installation

### Option 1: Debian Packages (Recommended)

1. **Set locale to UTF-8**:
```bash
locale  # Check for UTF-8
sudo apt update && sudo apt install locales
sudo locale-gen en_US.UTF-8
```

2. **Add ROS2 apt repository**:
```bash
sudo apt update && sudo apt install curl gnupg lsb-release
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key -o /usr/share/keyrings/ros-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] http://packages.ros.org/ros2/ubuntu $(source /etc/os-release && echo $UBUNTU_CODENAME) main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null
```

3. **Install ROS2 packages**:
```bash
sudo apt update
sudo apt install ros-humble-desktop
```

4. **Install additional dependencies**:
```bash
sudo apt install python3-rosdep python3-rosinstall python3-rosinstall-generator python3-wstool build-essential
```

5. **Initialize rosdep**:
```bash
sudo rosdep init
rosdep update
```

### Option 2: Binary Release

1. **Download ROS2 binary**:
```bash
cd ~
wget https://github.com/ros2/ros2/releases/download/humble/20230523-ros2-humble-linux-jammy-amd64.tar.xz
```

2. **Extract and source**:
```bash
tar -xf 20230523-ros2-humble-linux-jammy-amd64.tar.xz
```

## Environment Setup

### Sourcing ROS2
Add the following line to your `~/.bashrc` file:

```bash
source /opt/ros/humble/setup.bash
```

Or for the binary installation:
```bash
source ~/ros2_humble/setup.bash
```

### Verification
Test your installation:
```bash
source /opt/ros/humble/setup.bash
ros2 run demo_nodes_cpp talker
```

In another terminal:
```bash
source /opt/ros/humble/setup.bash
ros2 run demo_nodes_py listener
```

## Humanoid-Specific ROS2 Packages

### Essential Packages
Install packages specifically useful for humanoid robots:

```bash
# Control packages
sudo apt install ros-humble-joint-state-publisher ros-humble-robot-state-publisher

# Navigation packages
sudo apt install ros-humble-navigation2 ros-humble-nav2-bringup

# Simulation packages
sudo apt install ros-humble-gazebo-ros-pkgs ros-humble-gazebo-plugins

# Perception packages
sudo apt install ros-humble-vision-opencv ros-humble-cv-bridge ros-humble-image-transport

# Motion planning
sudo apt install ros-humble-moveit ros-humble-moveit-visual-tools
```

### Humanoid-Specific Controllers
```bash
# Install ros-controls
sudo apt install ros-humble-ros2-control ros-humble-ros2-controllers
sudo apt install ros-humble-joint-trajectory-controller ros-humble-diff-drive-controller
```

## Workspace Setup for Humanoid Development

### Creating a Workspace
```bash
mkdir -p ~/humanoid_ws/src
cd ~/humanoid_ws
colcon build --symlink-install
source install/setup.bash
```

### Adding to Environment
Add the following to your `~/.bashrc`:

```bash
source ~/humanoid_ws/install/setup.bash
```

## Real-time Configuration

For humanoid robot control, real-time performance is crucial:

### Install Real-time Kernel
```bash
sudo apt install linux-image-rt-generic
```

### Configure Real-time Settings
Add to `/etc/security/limits.conf`:
```
# Real-time priority for ROS2 nodes
username    -    rtprio    99
username    -    memlock   unlimited
```

## Network Configuration

### ROS2 Domain ID
For humanoid robot applications, use a specific domain ID to avoid interference:

```bash
export ROS_DOMAIN_ID=42
```

### Fast DDS Configuration
Create `~/fastdds_config.xml` for optimized communication:

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<dds>
    <profiles xmlns="http://www.eprosima.com/XMLSchemas/fastRTPS_Profiles">
        <transport_descriptors>
            <transport_descriptor>
                <transport_id>CustomUdpTransport</transport_id>
                <type>UDPv4</type>
            </transport_descriptor>
        </transport_descriptors>
        <participant profile_name="CustomParticipantProfile" is_default_profile="true">
            <rtps>
                <userTransports>
                    <transport_id>CustomUdpTransport</transport_id>
                </userTransports>
                <useBuiltinTransports>false</useBuiltinTransports>
                <sendSocketBufferSize>1048576</sendSocketBufferSize>
                <listenSocketBufferSize>1048576</listenSocketBufferSize>
            </rtps>
        </participant>
    </profiles>
</dds>
```

## Development Environment Setup

### IDE Configuration
For VS Code with ROS2 development:

1. Install the ROS extension
2. Configure the workspace with the following settings:

```json
{
    "cmake.configureOnOpen": true,
    "ros.distro": "humble",
    "terminal.integrated.env.linux": {
        "ROS_DISTRO": "humble",
        "ROS_DOMAIN_ID": "42"
    }
}
```

### Build Tools
```bash
sudo apt install python3-colcon-common-extensions
sudo apt install python3-vcstool
```

## Testing the Setup

### Basic ROS2 Test
```bash
# Check ROS2 installation
ros2 --version

# Check available nodes
ros2 node list

# Check available topics
ros2 topic list
```

### Humanoid-Specific Test
Create a simple test to verify humanoid control setup:

```bash
# Create a test package
cd ~/humanoid_ws/src
ros2 pkg create --build-type ament_cmake humanoid_test
cd ~/humanoid_ws
colcon build --packages-select humanoid_test
source install/setup.bash
```

## Troubleshooting

### Common Issues
- **Package not found**: Ensure your workspace is sourced with `source install/setup.bash`
- **Permission denied**: Check user permissions and real-time settings
- **Network issues**: Verify ROS_DOMAIN_ID and network configuration

### Performance Issues
- **High latency**: Check network configuration and real-time kernel
- **CPU usage**: Optimize node execution and message rates
- **Memory leaks**: Monitor with `htop` and check for proper cleanup

## Next Steps

Continue with the [Architecture](./architecture.md) section to understand the ROS2 architecture patterns specifically designed for humanoid robot control.