import { Brain, Clock, Users } from "lucide-react";

/**
 * Returns the appropriate icon for a given quiz ID
 */
export const getQuizIcon = (quizId: string) => {
  switch (quizId) {
    case "stop-bang":
      return <Brain className="h-5 w-5 text-blue-600" />;
    case "Epworth":
      return <Clock className="h-5 w-5 text-purple-600" />;
    default:
      return <Users className="h-5 w-5 text-green-600" />;
  }
};

/**
 * Returns the appropriate gradient color classes for a given quiz ID
 */
export const getQuizColor = (quizId: string) => {
  switch (quizId) {
    case "stop-bang":
      return "from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20";
    case "Epworth":
      return "from-purple-500/10 to-purple-600/10 hover:from-purple-500/20 hover:to-purple-600/20";
    default:
      return "from-green-500/10 to-green-600/10 hover:from-green-500/20 hover:to-green-600/20";
  }
};

/**
 * Returns the appropriate border color classes for a given quiz ID
 */
export const getBorderColor = (quizId: string) => {
  switch (quizId) {
    case "stop-bang":
      return "border-blue-200 hover:border-blue-300";
    case "Epworth":
      return "border-purple-200 hover:border-purple-300";
    default:
      return "border-green-200 hover:border-green-300";
  }
};
