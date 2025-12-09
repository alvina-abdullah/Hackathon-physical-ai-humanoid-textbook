import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'AI Systems Introduction',
    description: (
      <>
        Learn fundamental AI concepts and techniques specifically tailored for humanoid robotics applications.
        Understand machine learning, neural networks, and perception systems that power intelligent robots.
      </>
    ),
  },
  {
    title: 'ROS2 Humanoid Control',
    description: (
      <>
        Master ROS2-based control systems for humanoid robots. Learn joint control, trajectory planning,
        sensor integration, and real-time control techniques essential for robot operation.
      </>
    ),
  },
  {
    title: 'Digital Twin Simulation',
    description: (
      <>
        Explore digital twin technologies and simulation environments for safe development and testing.
        Bridge the gap between simulation and reality with advanced validation techniques.
      </>
    ),
  },
  {
    title: 'AI Robot Brain',
    description: (
      <>
        Understand cognitive architectures and decision-making systems that form the "brain" of AI robots.
        Learn about planning, learning, reasoning, and memory systems for autonomous behavior.
      </>
    ),
  },
  {
    title: 'Safe Development',
    description: (
      <>
        Follow best practices for safe humanoid robot development. Learn about safety protocols,
        emergency procedures, and risk management in robotics applications.
      </>
    ),
  },
  {
    title: 'Real-World Applications',
    description: (
      <>
        Discover practical applications of humanoid robots in healthcare, manufacturing, education,
        and service industries. Learn how to implement solutions for real-world problems.
      </>
    ),
  },
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
