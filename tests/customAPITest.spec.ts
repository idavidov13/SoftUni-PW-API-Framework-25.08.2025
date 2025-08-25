import { User, UserSchema } from "../fixtures/api/schemas";
import { test, expect } from "../fixtures/test-options";

test("Custom API Test", { tag: "@API" }, async ({ apiRequest }) => {
  const { status, body } = await apiRequest<User>({
    method: "POST",
    url: "users/login",
    baseUrl: "https://conduit-api.bondaracademy.com/api/",
    body: { user: { email: "softuni@test.bg", password: "softuni123" } },
  });

  console.log(body);
  expect(status).toBe(200);
  expect(body.user.email).toBe("softuni@test.bg");
  expect(UserSchema.parse(body)).toBeTruthy();
});
