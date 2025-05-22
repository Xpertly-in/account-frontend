/**
 * Supabase-related mocks for testing
 */

/**
 * Creates mock implementations for Supabase auth and database functions
 * @returns Object containing references to the created mocks
 */
export const createSupabaseMocks = () => {
  const authMock = {
    signUp: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChange: jest.fn(),
    getSession: jest.fn(),
    getUser: jest.fn(),
  };

  const databaseMock = {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    }),
  };

  jest.mock("@/lib/supabase", () => ({
    __esModule: true,
    supabase: {
      auth: authMock,
      ...databaseMock,
    },
  }));

  return { authMock, databaseMock };
};

/**
 * Creates mock implementation for Supabase storage
 */
export const createSupabaseStorageMock = () => {
  const storageMock = {
    from: jest.fn().mockReturnValue({
      upload: jest.fn(),
      download: jest.fn(),
      list: jest.fn(),
      remove: jest.fn(),
      getPublicUrl: jest
        .fn()
        .mockReturnValue({ data: { publicUrl: "https://example.com/image.jpg" } }),
    }),
  };

  // Extend existing Supabase mock
  jest.mock("@/lib/supabase", () => {
    const existingMock = jest.requireMock("@/lib/supabase");
    return {
      ...existingMock,
      supabase: {
        ...existingMock.supabase,
        storage: storageMock,
      },
    };
  });

  return storageMock;
};
