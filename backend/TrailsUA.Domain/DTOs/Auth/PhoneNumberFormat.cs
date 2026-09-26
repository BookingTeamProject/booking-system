using System.Text.RegularExpressions;

namespace TrailsUA.Domain.DTOs.Auth;

public static class PhoneNumberFormat
{
    public static string? Normalize(string? value)
    {
        if (string.IsNullOrWhiteSpace(value)) return null;
        var normalized = Regex.Replace(value.Trim(), @"[\s()\-]", "");
        if (!Regex.IsMatch(normalized, @"^\+[1-9][0-9]{6,14}$"))
            throw new ArgumentException("Вкажіть міжнародний номер: +код країни та номер (7–15 цифр).");
        return normalized;
    }
}
