export type LoginResponse = {
  token: string;

  user: {
    id: string;
    name: string;
    email: string;
  };

  roles: {
    name: string;

    permissions: {
      name: string;
    }[];
  }[];
};
