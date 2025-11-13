import React, { Component } from "react";
import { IMAGE_PATHS } from "../constants/constants";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  handleGoHome = () => {
    window.location.replace("#/main");
    window.location.reload();    
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="
        w-screen h-screen flex flex-col items-center justify-center
        bg-slate-900 relative group
      ">
        <img
          src={IMAGE_PATHS.ERROR_OCCURRED}
          alt="error"
          className="
            w-[40vw] sm:w-[30vw] md:w-[28vw] 
            max-w-[380px]
            object-contain
            cursor-pointer 
            hover:scale-105 transition-transform
            animate-[fadeInUp_0.5s_ease-out]
          "
          onClick={this.handleGoHome}
        />

           <button
          onClick={this.handleGoHome}
          className="
            mt-5 
            text-slate-100 dark:text-slate-300
            text-base font-medium
            opacity-0
            group-hover:opacity-100
            transition-opacity duration-500
            hover:underline
            animate-[fadeInUp_0.8s_ease-out]
          "
        >
          Go Home →
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
