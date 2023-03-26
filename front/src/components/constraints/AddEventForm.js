import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, TextField, Tooltip, Typography } from '@mui/material';
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';
import '@mui/lab';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
// import ColorPalette from './ColorPalette';
import { gridSpacing } from 'store/constant';

// assets
import DateRangeIcon from '@mui/icons-material/DateRange';
import DeleteIcon from '@mui/icons-material/Delete';

// constant
const getInitialValues = (event, range) => {
    const newEvent = {
        title: '',
        description: '',
        color: '#2196f3',
        textColor: '',
        allDay: false,
        start: range ? new Date(range.start) : new Date(),
        end: range ? new Date(range.end) : new Date()
    };

    if (event || range) {
        return _.merge({}, newEvent, event);
    }

    return newEvent;
};

// ==============================|| CALENDAR EVENT ADD / EDIT / DELETE ||============================== //

const AddEventFrom = ({ event, range, handleDelete, handleCreate, handleUpdate, onCancel }) => {
    const theme = useTheme();
    const isCreating = !event;

    const EventSchema = Yup.object().shape({
        title: Yup.string().max(255).required('Title is required'),
        description: Yup.string().max(5000),
        end: Yup.date().when('start', (start, schema) => start && schema.min(start, 'End date must be later than start date')),
        start: Yup.date(),
        color: Yup.string().max(255),
        textColor: Yup.string().max(255)
    });

    const formik = useFormik({
        initialValues: getInitialValues(event, range),
        validationSchema: EventSchema,
        onSubmit: async (values, { resetForm, setSubmitting }) => {
            try {
                const data = {
                    title: values.title,
                    description: values.description,
                    color: values.color,
                    textColor: values.textColor,
                    allDay: values.allDay,
                    start: values.start,
                    end: values.end
                };

                if (event) {
                    handleUpdate(event.id, data);
                } else {
                    handleCreate(data);
                }

                resetForm();
                onCancel();
                setSubmitting(false);
            } catch (error) {
                console.error(error);
            }
        }
    });

    const { values, errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

    return (
        <FormikProvider value={formik}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <DialogTitle>Add Constraint</DialogTitle>
                    <Divider />
                    <DialogContent sx={{ p: 3 }}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Title"
                                    {...getFieldProps('title')}
                                    error={Boolean(touched.title && errors.title)}
                                    helperText={touched.title && errors.title}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Description"
                                    {...getFieldProps('description')}
                                    error={Boolean(touched.description && errors.description)}
                                    helperText={touched.description && errors.description}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>

                    <DialogActions sx={{ p: 3 }}>
                        <Grid container justifyContent="center" alignItems="center">
                            <Button type="button" variant="contained" color="secondary" onClick={onCancel}>
                                Save
                            </Button>
                        </Grid>
                    </DialogActions>
                </Form>
            </LocalizationProvider>
        </FormikProvider>
    );
};

AddEventFrom.propTypes = {
    event: PropTypes.object,
    range: PropTypes.object,
    handleDelete: PropTypes.func,
    handleCreate: PropTypes.func,
    handleUpdate: PropTypes.func,
    onCancel: PropTypes.func
};

export default AddEventFrom;
