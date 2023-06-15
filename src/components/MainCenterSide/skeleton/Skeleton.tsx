import React from "react";
import "../../../STYLES/Home/component/Skeleton/Skeleton.css";
interface SkeletonProps {
  percentage: number | undefined;
  height?: number;
}
const Skeleton = ({ percentage, height = 850 }: SkeletonProps) => {
  return (
    <div className="skeleton_post" style={{ width: `${percentage}%`, height }}>
      <div className="skeleton_section_user">
        <div className="wrapper_image">
          <div className="content_skeleton" />
        </div>
        <div className="wrapper_desc">
          <p>
            <div className="content_skeleton" />
          </p>
          <p>
            <div className="content_skeleton" />
          </p>
        </div>
      </div>
      <div className="skeleton_section_text">
        <p>
          <div className="content_skeleton" />
        </p>
        <p>
          <div className="content_skeleton" />
        </p>
      </div>
      <div className="skeleton_section_image">
        <div className="content_skeleton" />
      </div>
      <div className="skeleton_section_tools">
        <span>
          <div className="content_skeleton" />
        </span>
        <span>
          <div className="content_skeleton" />
        </span>
      </div>
      <div className="skeleton_section_chat">
        <span>
          <div className="content_skeleton" />
        </span>
        <span>
          <div className="content_skeleton" />
        </span>
        <span>
          <div className="content_skeleton" />
        </span>
      </div>
    </div>
  );
};

export default Skeleton;
