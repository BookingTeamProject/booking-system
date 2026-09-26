namespace TrailsUA.Domain.Exceptions;

public class RequestException(int statusCode, string message) : Exception(message)
{
    public int StatusCode { get; } = statusCode;
}
