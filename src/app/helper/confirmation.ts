import Swal from 'sweetalert2';

/** Use the portal's SweetAlert styles and Bootstrap theme buttons. */
export async function confirmAction(
  text: string,
  title = 'Delete this item?',
  confirmButtonText = 'Yes, delete',
): Promise<boolean> {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: 'Keep it',
    focusCancel: true,
    buttonsStyling: false,
    customClass: {
      confirmButton: 'btn btn-danger px-3',
      cancelButton: 'btn btn-outline-secondary px-3',
    },
  });

  return result.isConfirmed === true;
}
