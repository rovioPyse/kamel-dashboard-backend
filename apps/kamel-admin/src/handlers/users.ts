import { HttpResponse, requireAnyGroup } from "../shared/http";
import { UsersService } from "../services/users.service";
import type { HttpLambdaContext } from "../types/lambda";

class UsersHandler {
  private static authorize(lambdaContext: HttpLambdaContext): HttpResponse | null {
    return requireAnyGroup(lambdaContext.event, ["admin"]);
  }

  static async handleCreateUser(lambdaContext: HttpLambdaContext): Promise<HttpResponse> {
    const authError = UsersHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new UsersService(lambdaContext).createUser();
  }

  static async handleListUsers(lambdaContext: HttpLambdaContext): Promise<HttpResponse> {
    const authError = UsersHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new UsersService(lambdaContext).listUsers();
  }

  static async handleGetUser(lambdaContext: HttpLambdaContext): Promise<HttpResponse> {
    const authError = UsersHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new UsersService(lambdaContext).getUser();
  }

  static async handleUpdateUser(lambdaContext: HttpLambdaContext): Promise<HttpResponse> {
    const authError = UsersHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new UsersService(lambdaContext).updateUser();
  }

  static async handleAssignGroups(lambdaContext: HttpLambdaContext): Promise<HttpResponse> {
    const authError = UsersHandler.authorize(lambdaContext);
    if (authError) return authError;
    return new UsersService(lambdaContext).assignGroups();
  }
}

export default UsersHandler;
