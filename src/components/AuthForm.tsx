import { Form } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type FieldErrors = {
    [key: string]: string[] | undefined;
};

type AuthFormProps = {
    submitText: string;
    fields: {
        name: string;
        label: string;
        type: string;
        value?: string | number | readonly string[] | undefined;
    }[];
    isSubmitting: boolean;
    error?: string;
    fieldErrors?: FieldErrors; // Utilisation du type FieldErrors
};

export function AuthForm({
    submitText,
    fields,
    isSubmitting,
    error,
    fieldErrors, // Ajout de fieldErrors dans les props
}: AuthFormProps) {
    return (
        <Form method="post" className="space-y-8">
            {fields.map((field) => (
                <div key={field.name}>
                    <label htmlFor={field.name}>{field.label}</label>
                    <Input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        value={field.value}
                        required
                    />
                    {fieldErrors?.[field.name] && (
                        <p className="text-red-500 text-sm">
                            {fieldErrors[field.name]?.join(', ')}
                        </p>
                    )}
                </div>
            ))}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Connexion en cours...' : submitText}
            </Button>
        </Form>
    );
}
