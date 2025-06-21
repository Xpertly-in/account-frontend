import { toast } from "sonner";

// Toast configuration interface
interface ToastConfig {
  title: string;
  description?: string;
  duration?: number;
}

/**
 * Simple Toast utility wrapper for consistent messaging
 */
export class Toast {
  /**
   * Show a success toast
   */
  static success(config: ToastConfig) {
    return toast.success(config.title, {
      description: config.description,
      duration: config.duration,
    });
  }

  /**
   * Show an error toast
   */
  static error(config: ToastConfig) {
    return toast.error(config.title, {
      description: config.description,
      duration: config.duration,
    });
  }

  /**
   * Show an info toast
   */
  static info(config: ToastConfig) {
    return toast.info(config.title, {
      description: config.description,
      duration: config.duration,
    });
  }

  /**
   * Show a warning toast
   */
  static warning(config: ToastConfig) {
    return toast.warning(config.title, {
      description: config.description,
      duration: config.duration,
    });
  }
}

// Export the original toast function for direct use when needed
export { toast };
