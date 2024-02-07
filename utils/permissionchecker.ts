export const canUserAccessFeature = (userRole: string, featureRequiredRole: string): boolean => {
  const rolePriority: Record<string, number> = {
    'admin': 3,
    'manager': 2,
    'user': 1,
  };

  return rolePriority[userRole] >= rolePriority[featureRequiredRole];
};