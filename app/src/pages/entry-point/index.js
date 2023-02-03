//defining entry point for application
import { registerRootComponent } from 'expo';
import Provider from '../../helpers/context/provider';

//Entry point leads to application routes surrounded by context from multiple different sources for best state management.
registerRootComponent(Provider);
