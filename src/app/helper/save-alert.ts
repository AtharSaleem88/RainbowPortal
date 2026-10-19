import Swal from 'sweetalert2';

export async function showSaveSuccess(text: string): Promise<void> {
  await Swal.fire({
    title: 'Saved successfully',
    text,
    icon: 'success',
    confirmButtonText: 'Done',
    buttonsStyling: false,
    customClass: { confirmButton: 'btn btn-primary px-4' },
  });
}

export async function showSaveValidation(text: string): Promise<void> {
  await Swal.fire({
    title: 'Check the form',
    text,
    icon: 'warning',
    confirmButtonText: 'OK',
    buttonsStyling: false,
    customClass: { confirmButton: 'btn btn-primary px-4' },
  });
}
