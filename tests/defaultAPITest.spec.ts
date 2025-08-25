import { test, expect } from "@playwright/test";

test("Default API Test", async ({ request }) => {
  const response = await request.post(
    "https://conduit-api.bondaracademy.com/api/users/login",
    { data: { user: { email: "softuni@test.bg", password: "softuni123" } } }
  );

  const responseBody = await response.json();

  console.log(responseBody);

  expect(response.status()).toBe(200);
  expect(responseBody.user.email).toBe("softuni@test.bg");
  expect(responseBody.user.token).toBeDefined();
});
